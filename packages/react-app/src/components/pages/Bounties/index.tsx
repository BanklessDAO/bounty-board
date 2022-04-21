import { Stack, Text } from '@chakra-ui/react';
import BountyAccordion from './BountyAccordion';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Filters from './Filters';
import useDebounce from '../../../hooks/useDebounce';
import { CustomerContext } from '../../../context/CustomerContext';
import { BANKLESS } from '../../../constants/Bankless';
import useBounties from '../../../hooks/useBounties';
import { BountyCollection } from '../../../models/Bounty';
import BountyPaginate from './Filters/bountyPaginate';
import { useRouter } from 'next/router';
import { FilterParams } from '@app/types/Filter';
import { ParsedUrlQuery } from 'querystring';

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

const baseFilters: FilterParams = {
	search: '',
	status: 'Open',
	gte: 0,
	lte: Infinity,
	sortBy: 'reward',
	asc: false,
	customerId: BANKLESS.customerId,
	// no created or claimed
};

const useDynamicUrl = (filters: FilterParams): string => {
	const { customer } = useContext(CustomerContext);
	const debounceSearch = useDebounce(filters.search, 500, true);

	return useMemo(() => {
		const { status, lte, gte, sortBy, asc: sortAscending, claimedBy, createdBy } = filters;

		let urlQuery = `?status=${status === '' ? 'All' : status}`;
		if (debounceSearch) urlQuery += `&search=${debounceSearch}`;
		if (lte) urlQuery += `&lte=${lte}`;
		if (gte) urlQuery += `&gte=${gte}`;
		if (sortBy) urlQuery += `&sortBy=${sortBy}`;
		if (sortAscending) urlQuery += `&asc=${sortAscending}`;
		if (customer) urlQuery += `&customerId=${customer.customerId ?? BANKLESS.customerId}`;
		if (customer) urlQuery += `&customerKey=${customer.customerKey ?? BANKLESS.customerKey}`;
		if (claimedBy) urlQuery += `&claimedBy=${claimedBy}`;
		if (createdBy) urlQuery += `&createdBy=${createdBy}`;

		return urlQuery;

	}, [filters, BANKLESS, customer, debounceSearch]);
};

const usePaginatedBounties = (bounties: BountyCollection[] | undefined, page: number) => {
	// splits bounties according to the maximum page size
	return useMemo(() => bounties
		? bounties.slice(PAGE_SIZE * page, Math.min(bounties.length, PAGE_SIZE * (page + 1)))
		: []
	, [bounties, page, PAGE_SIZE]);
};

const getFiltersFromUrl = (query: ParsedUrlQuery): FilterParams => Object.entries(query).reduce((prev, [key, val]) => {
	/**
	 * Grab filters from the url, using fallback values if we see 'undefined'
	 */
	const isValid = (val && val !== 'undefined');
	const existing = baseFilters[key as keyof FilterParams];
	const adjVal = isValid ? val : existing;
	return {
		...prev,
		...{ [key]: adjVal },
	};
}, {} as FilterParams);

const filtersDefined = (query: ParsedUrlQuery): boolean => !Object.values(query).some(item => item === 'undefined');

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
	}, [router, firstLoad]);

	const urlQuery = useDynamicUrl(filters);

	useEffect(() => {
		if (router.isReady) {
			router.push(urlQuery, undefined, { shallow: true });
		}
	}, [urlQuery, router.isReady]);

	const { bounties, isLoading, isError } = useBounties('/api/bounties' + urlQuery);
	const paginatedBounties = usePaginatedBounties(bounties, page);
	const noResults = ((filters.search || filters.status) && bounties && paginatedBounties.length === 0);


	useEffect(() => {
		setPage(0);
	}, [filters.search, filters.gte, filters.lte, filters.sortBy]);

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
