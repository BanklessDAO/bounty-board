import { Stack, Text } from '@chakra-ui/react';
import BountyAccordion from './BountyAccordion';
import React, { useContext, useEffect, useState } from 'react';
import Filters from './Filters';
import useDebounce from '../../../hooks/useDebounce';
import { CustomerContext } from '../../../context/CustomerContext';
import { BANKLESS } from '../../../constants/Bankless';
import useBounties from '../../../hooks/useBounties';
import { BountyCollection } from '../../../models/Bounty';
import BountyPaginate from './Filters/bountyPaginate';

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
		<Text	fontSize="lg">{ message }</Text>
	</Stack>
);

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
	const debounceSearch = useDebounce(search, 500, true);

	const { customer } = useContext(CustomerContext);
	const { customer_id } = customer;

	let dynamicUrl = '/api/bounties';
	dynamicUrl += `?status=${status === '' ? 'All' : status}`;
	dynamicUrl += `&search=${debounceSearch}`;
	dynamicUrl += `&lte=${lte}`;
	dynamicUrl += `&gte=${gte}`;
	dynamicUrl += `&sortBy=${sortBy}`;
	dynamicUrl += `&asc=${sortAscending}`;
	dynamicUrl += `&customer_id=${customer_id ?? BANKLESS.customer_id}`;

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
				<Filters
					status={status} setStatus={setStatus}
					search={search} setSearch={setSearch}
					lte={lte} setLte={setLte}
					gte={gte} setGte={setGte}
					sortBy={sortBy} setSortBy={setSortBy}
					sortAscending={sortAscending} setSortAscending={setSortAscending}
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
