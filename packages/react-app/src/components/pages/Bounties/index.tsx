import { Stack, Text, VStack, Button } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import BountyAccordion from './BountyAccordion';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import Filters from './Filters';
import useDebounce from '../../../hooks/useDebounce';
import { CustomerContext } from '../../../context/CustomerContext';
import { BANKLESS } from '../../../constants/Bankless';
import useBounties from '../../../hooks/useBounties';
import { BountyCollection } from '../../../models/Bounty';
import BountyPaginate from './Filters/bountyPaginate';
import { CSVLink } from 'react-csv';
import { BOUNTY_EXPORT_ITEMS } from '../../../constants/bountyExportItems';
import MiscUtils from '../../../utils/miscUtils';

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
		<Text	fontSize="lg">{ message }</Text>
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

const Bounties = (): JSX.Element => {
	/* Bounties will fetch all data to start, unless a single bounty is requested */
	const [page, setPage] = useState(0);
	const [status, setStatus] = useState('Open');
	const [search, setSearch] = useState('');
	const [gte, setGte] = useState(0);
	// how to handle the lte === 0 case?
	const [lte, setLte] = useState(Infinity);
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortAscending, setSortAscending] = useState(false);
	const [selectedBounties, setSelectedBounties] = useState<string[]>([]);
	const debounceSearch = useDebounce(search, 500, true);

	const { customer } = useContext(CustomerContext);
	const { customerId } = customer;

	let dynamicUrl = '/api/bounties';
	dynamicUrl += `?status=${status === '' ? 'All' : status}`;
	dynamicUrl += `&search=${debounceSearch}`;
	dynamicUrl += `&lte=${lte}`;
	dynamicUrl += `&gte=${gte}`;
	dynamicUrl += `&sortBy=${sortBy}`;
	dynamicUrl += `&asc=${sortAscending}`;
	dynamicUrl += `&customerId=${customerId ?? BANKLESS.customerId}`;

	useEffect(() => {
		setPage(0);
	}, [search, gte, lte, sortBy]);

	const { bounties, isLoading, isError } = useBounties(dynamicUrl);

	const paginatedBounties = bounties
		? bounties.slice(PAGE_SIZE * page, Math.min(bounties.length, PAGE_SIZE * (page + 1)))
		: [];

	const noResults = ((search || status) && bounties && paginatedBounties.length === 0);
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
						status={status} setStatus={setStatus}
						search={search} setSearch={setSearch}
						lte={lte} setLte={setLte}
						gte={gte} setGte={setGte}
						sortBy={sortBy} setSortBy={setSortBy}
						sortAscending={sortAscending} setSortAscending={setSortAscending}
					/>
					<SelectExport bounties={bounties} selectedBounties={selectedBounties} setSelectedBounties={setSelectedBounties}/>
				</VStack>
				{isError || noResults
					? <FilterResultPlaceholder message={'No Results'} />
					: isLoading
						? <FilterResultPlaceholder message={'Loading'} />
						: <BountyAccordion bounties={paginatedBounties} selectedBounties={selectedBounties} setSelectedBounties={setSelectedBounties}/>
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
