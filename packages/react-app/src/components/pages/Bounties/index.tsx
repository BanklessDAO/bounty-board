import { Stack, Text, VStack } from '@chakra-ui/react';
import BountyList from './BountyList';
import React, { useMemo, useEffect, useState, useRef, createContext, SetStateAction, Dispatch } from 'react';
import Filters from './Filters';
import useBounties from '@app/hooks/useBounties';
import { BountyCollection } from '@app/models/Bounty';
import BountyPaginate from './Filters/bountyPaginate';
import { SelectExport } from './Form/SelectExport';
import { useRouter } from 'next/router';
import { FilterParams } from '@app/types/Filter';
import {
	baseFilters,
	filtersDefined,
	getFiltersFromUrl,
	useDynamicUrl,
} from '@app/hooks/useUrlFilters';
import SavedQueriesMenu from './Filters/SavedQueriesMenu';
import { mutate } from 'swr';

export const PAGE_SIZE = 10;

const maxPages = (
	bounties: BountyCollection | BountyCollection[] | undefined
) => {
	if (!bounties || !Array.isArray(bounties)) return 0;
	const numFullPages = Math.floor(bounties.length / PAGE_SIZE);
	const hasExtraPage = bounties.length % PAGE_SIZE != 0;
	return hasExtraPage ? numFullPages + 1 : numFullPages;
};

const FilterResultPlaceholder = ({
	message,
}: {
	message: string;
}): JSX.Element => (
	<Stack
		borderWidth={3}
		borderRadius={10}
		textAlign="center"
		direction="row"
		justify="center"
		align="center"
		width=" 100%"
	>
		<Text fontSize="lg">{message}</Text>
	</Stack>
);

type UsePaginatedBountiesResult = {
	paginatedBounties: BountyCollection[];
	noResults: boolean;
};
const usePaginatedBounties = (
	bounties: BountyCollection[] | undefined,
	page: number,
	filters: FilterParams
): UsePaginatedBountiesResult => {
	// splits bounties according to the maximum page size
	return useMemo(() => {
		const paginatedBounties = bounties
			? bounties.slice(
				PAGE_SIZE * page,
				Math.min(bounties.length, PAGE_SIZE * (page + 1))
			)
			: [];

		const noResults = Boolean(
			(filters.search || filters.status || filters.tags) &&
			bounties &&
			paginatedBounties.length === 0
		);
		return { paginatedBounties, noResults };
	}, [bounties, page, PAGE_SIZE, filters.status, filters.search, filters.tags]);
};

interface BountiesUpdatedContextInterface {
	bountiesUpdated: boolean;
	setBountiesUpdated: Dispatch<SetStateAction<boolean>>;
}
export const BountiesUpdatedContext = createContext<BountiesUpdatedContextInterface>({
	bountiesUpdated: false,
	setBountiesUpdated: () => false,
});

const Bounties = (): JSX.Element => {
	/* Bounties will fetch all data to start, unless a single bounty is requested */
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [filters, setFilters] = useState<FilterParams>(baseFilters);
	const [selectedBounties, setSelectedBounties] = useState<string[]>([]);
	const [bountiesUpdated, setBountiesUpdated] = useState(false);

	// Watch this only runs on page load once the params are instantiated
	// otherwise you will lose filers and/or create inf loop
	// only render the saved search the first time, to prevent loops
	const firstLoad = useRef(true);
	const urlQuery = useDynamicUrl(
		filters,
		router.isReady && !firstLoad.current
	);

	useEffect(() => {
		if (!router.isReady) return;

		const asPathWithoutLeadingSlash = router.asPath.replace(/\//, '');
		if (
			(firstLoad.current && filtersDefined(router.query)) ||
			(!firstLoad.current &&
				Object.keys(router.query).length > 0 &&
				asPathWithoutLeadingSlash !== urlQuery)
		) {
			const newFilters = getFiltersFromUrl({ ...baseFilters, ...router.query });
			setFilters(newFilters);
			firstLoad.current = false;
		}
	}, [router.isReady, router.query, firstLoad]);

	// If the URL changed, take us there
	useEffect(() => {
		if (router.isReady) {
			router.push(urlQuery, undefined, { shallow: true });
		}
		setPage(0);
	}, [urlQuery, router.isReady]);

	const { bounties, isLoading, isError } = useBounties(
		'/api/bounties' + urlQuery,
		router.isReady
	);

	// Force a fetch of the bounties if bounties updated
	useEffect(() => {
		console.log(`Bounties Updated: ${bountiesUpdated}`);
		if (bountiesUpdated) {
			mutate('/api/bounties' + urlQuery);
			setBountiesUpdated(false);
			setPage(0);
		}
	}, [firstLoad, bountiesUpdated]);

	const { paginatedBounties, noResults } = usePaginatedBounties(
		bounties,
		page,
		filters
	);

	return (
		<BountiesUpdatedContext.Provider value={{ bountiesUpdated, setBountiesUpdated }}>
			<Stack direction={{ base: 'column', lg: 'row' }}>
				<SavedQueriesMenu />
				<Stack
					direction={{ base: 'column' }}
					align="center"
					fontSize="sm"
					fontWeight="600"
					gridGap="4"

					width={'100%'}>
					<VStack gridGap="1px" width={'100%'}>
						<Filters
							bounties={bounties}
							filters={filters}
							setFilters={setFilters}
						/>
						<SelectExport
							bounties={bounties}
							selectedBounties={selectedBounties}
							setSelectedBounties={setSelectedBounties}
						/>
					</VStack>

					{isError || noResults ? (
						<FilterResultPlaceholder message={'No Results'} />
					) : isLoading ? (
						<FilterResultPlaceholder message={'Loading'} />
					) : (
						<BountyList
							bounties={paginatedBounties}
							selectedBounties={selectedBounties}
							setSelectedBounties={setSelectedBounties} />
					)}
					<BountyPaginate
						page={page}
						setPage={setPage}
						maxPages={maxPages(bounties)} />
				</Stack>
			</Stack>
		</BountiesUpdatedContext.Provider>
	);
};

export default Bounties;
