import { Stack, Text } from '@chakra-ui/react';
import BountyAccordion from './BountyAccordion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Filters from './Filters';
import useBounties from '@app/hooks/useBounties';
import { BountyCollection } from '@app/models/Bounty';
import BountyPaginate from './Filters/bountyPaginate';
import { useRouter } from 'next/router';
import { FilterParams } from '@app/types/Filter';
import { baseFilters, filtersDefined, getFiltersFromUrl, useDynamicUrl } from '@app/hooks/useUrlFilters';

export const PAGE_SIZE = 10;

const maxPages = (bounties: BountyCollection | BountyCollection[] | undefined) => {
	if (!bounties || !Array.isArray(bounties)) return 0;
	const numFullPages = Math.floor(bounties.length / PAGE_SIZE);
	const hasExtraPage = bounties.length % PAGE_SIZE != 0;
	return hasExtraPage ? numFullPages + 1 : numFullPages;
};

const FilterResultPlaceholder = ({ message }: { message: string }): JSX.Element => (
	<Stack
		borderWidth={3}
		borderRadius={10}
		width={{ base: '95vw', lg: '700px' }}
		textAlign="center"
		direction="row"
		justify="center"
		align="center"
	>
		<Text fontSize="lg">{message}</Text>
	</Stack>
);

type UsePaginatedBountiesResult = { paginatedBounties: BountyCollection[], noResults: boolean }
const usePaginatedBounties = (bounties: BountyCollection[] | undefined, page: number, filters: FilterParams): UsePaginatedBountiesResult => {
	// splits bounties according to the maximum page size
	return useMemo(() => {
		const paginatedBounties = bounties
			? bounties.slice(PAGE_SIZE * page, Math.min(bounties.length, PAGE_SIZE * (page + 1)))
			: [];

		const noResults = Boolean(((filters.search || filters.status) && bounties && paginatedBounties.length === 0));
		return { paginatedBounties, noResults };
	}, [bounties, page, PAGE_SIZE, filters.status, filters.search]);
};

const Bounties = (): JSX.Element => {
	/* Bounties will fetch all data to start, unless a single bounty is requested */
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [filters, setFilters] = useState<FilterParams>(baseFilters);

	// Watch this only runs on page load once the params are instantiated
	// otherwise you will lose filers and/or create inf loop
	// only render the saved search the first time, to prevent loops
	const firstLoad = useRef(true);
	useEffect(() => {
		if (router.isReady && firstLoad.current && filtersDefined(router.query)) {
			const newFilters = getFiltersFromUrl(router.query);
			setFilters(newFilters);
			firstLoad.current = false;
		}
	}, [router.isReady, router.query, firstLoad]);

	const urlQuery = useDynamicUrl(filters, router.isReady && !firstLoad.current);

	useEffect(() => {
		if (router.isReady) {
			router.push(urlQuery, undefined, { shallow: true });
		}
	}, [urlQuery, router.isReady]);

	const { bounties, isLoading, isError } = useBounties('/api/bounties' + urlQuery, router.isReady);
	const { paginatedBounties, noResults } = usePaginatedBounties(bounties, page, filters);

	useEffect(() => {
		setPage(0);
	}, [filters.search, filters.gte, filters.lte, filters.sortBy, filters?.claimedBy, filters?.createdBy]);

	return (
		<>
			<Stack
				direction={{ base: 'column', lg: 'row' }}
				align="top"
				fontSize="sm"
				fontWeight="600"
				gridGap="4"
			>
				<Filters
					filters={filters}
					setFilters={setFilters}
				/>
				{isError || noResults
					? <FilterResultPlaceholder message={'No Results'} />
					: isLoading
						? <FilterResultPlaceholder message={'Loading'} />
						: <BountyAccordion bounties={paginatedBounties} />
				}
			</Stack>
			<BountyPaginate
				page={page}
				setPage={setPage}
				maxPages={maxPages(bounties)}
			/>
		</>
	);
};

export default Bounties;
