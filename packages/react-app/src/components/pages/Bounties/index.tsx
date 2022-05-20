import { Stack, Text, VStack, Button } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import BountyList from './BountyList';
import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import Filters from './Filters';
import useBounties from '@app/hooks/useBounties';
import { BountyCollection } from '@app/models/Bounty';
import BountyPaginate from './Filters/bountyPaginate';
import { CSVLink } from 'react-csv';
import { BOUNTY_EXPORT_ITEMS } from '../../../constants/bountyExportItems';
import MiscUtils from '../../../utils/miscUtils';
import { useRouter } from 'next/router';
import { FilterParams } from '@app/types/Filter';
import { baseFilters, filtersDefined, getFiltersFromUrl, useDynamicUrl } from '@app/hooks/useUrlFilters';

export const PAGE_SIZE = 10;

type SetState<T extends any> = (arg: T) => void;

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

/**
Define a set state function that runs a callback on setting of the state
**/

function useStateCallback<T, C extends CallableFunction =(...args: any) => void>(initialState: T): [T, (state: T, cb: C) => void] {
	const [state, setState] = useState<T>(initialState);
	// init mutable ref container for callbacks
	const cbRef = useRef<C | null>(null);

	const setStateCallback = useCallback((s: T, cb: C) => {
		// store current, passed callback in ref
		cbRef.current = cb;
		// keep object reference stable, exactly like `useState`
		setState(s);
	}, []);

	useEffect(() => {
		// cb.current is `null` on initial render, 
		// so we only invoke callback on state *updates*
		if (cbRef.current) {
			cbRef.current(state);
			// reset callback after execution
			cbRef.current = null;
		}
	}, [state]);

	return [state, setStateCallback];
}

const SelectExport = (({ bounties, selectedBounties, setSelectedBounties }: {
	bounties: BountyCollection[] | undefined,
	selectedBounties: string[],
	setSelectedBounties: SetState<string[]>,
	}): JSX.Element => {

	const { colorMode } = useColorMode();
	const [csvData, setCsvData] = useStateCallback<Record<string, unknown>[]>([]);
	const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);

	const handleSelectAll = (): void => {
		if (bounties && selectedBounties.length < bounties.length) {
			setSelectedBounties(bounties.map(({ _id }) => _id));
		}
	};

	const handleClearAll = (): void => {
		setSelectedBounties([]);
	};

	const handleCSV = (): void => {
		if (bounties && csvLink.current) {
			const getCsvData = bounties
				.filter(({ _id }) => selectedBounties.includes(_id))
				.map(MiscUtils.csvEncode);
				
			setCsvData(getCsvData, () => {
				csvLink?.current?.link.click();
			});
		}
	};

	return (
		<Stack justify="space-between" direction="row" mt={1}>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == bounties.length}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleSelectAll}
			>
				Select All
			</Button>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == 0}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleClearAll}
			>
				Clear All
			</Button>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == 0}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleCSV}
			>
				Export
			</Button>
			<CSVLink
			  	data={csvData}
				headers={BOUNTY_EXPORT_ITEMS}
				filename='bounties.csv'
				className='hidden'
				ref={csvLink}
				target='_blank'
			/>
		</Stack>
	);
});

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
	const [selectedBounties, setSelectedBounties] = useState<string[]>([]);

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
				<VStack
				  gridGap="1px"
				>
					<Filters
						filters={filters}
					  setFilters={setFilters}
					/>
					<SelectExport bounties={bounties} selectedBounties={selectedBounties} setSelectedBounties={setSelectedBounties}/>
				</VStack>

				{isError || noResults
					? <FilterResultPlaceholder message={'No Results'} />
					: isLoading
						? <FilterResultPlaceholder message={'Loading'} />
						: <BountyList bounties={paginatedBounties} selectedBounties={selectedBounties} setSelectedBounties={setSelectedBounties}/>
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
