import { Stack, Text, Flex } from '@chakra-ui/react';
import BountyList from './BountyList';
import SkeletonLoader from '../../parts/SkeletonLoader';
import useSWR from 'swr';
import Bounty from './Bounty';
import React, { useContext, useEffect, useState } from 'react';
import Filters from './Filters';
import useDebounce from '../../../hooks/useDebounce';
import { CustomerContext } from '../../../context/CustomerContext';
import { BANKLESS } from '../../../constants/Bankless';

export type PreFilterProps = {
	id?: string | string[];
};

export const PAGE_SIZE = 10;

const fetcher = (url: string) =>
	fetch(url)
		.then((res) => res.json())
		.then((json) => json.data);

const Bounties = ({ id }: PreFilterProps): JSX.Element => {
	/* Bounties will fetch all data to start, unless a single bounty is requested */
	const [page, setPage] = useState(0);
	const [status, setStatus] = useState('Open');
	const [search, setSearch] = useState('');
	const [gte, setGte] = useState(0);
	// how to handle the lte === 0 case?
	const [lte, setLte] = useState(Infinity);
	const [sortBy, setSortBy] = useState('');
	const [sortAscending, setSortAscending] = useState(true);
	const debounceSearch = useDebounce(search, 500, true);

	const { customer } = useContext(CustomerContext);
	const { customer_id } = customer;

	let dynamicUrl = 'https://bountyboard.bankless.community/api/bounties';
	dynamicUrl += `?status=${status === '' ? 'All' : status}`;
	dynamicUrl += `&search=${debounceSearch}`;
	dynamicUrl += `&lte=${lte}`;
	dynamicUrl += `&gte=${gte}`;
	dynamicUrl += `&sortBy=${sortBy}`;
	dynamicUrl += `&asc=${sortAscending}`;
	// empty customer id will pass string as "undefined"
	dynamicUrl += `&customer_id=${customer_id ?? BANKLESS.customer_id}`;

	const { data: bounties, error } = useSWR(
		id
			? `https://bountyboard.bankless.community/api/bounties/${id}`
			: dynamicUrl,
		fetcher
	);

	useEffect(() => {
		setPage(0);
	}, [search, gte, lte, sortBy]);

	if (error) return <p>Failed to load</p>;

	const paginatedBounties =
		!id &&
		bounties &&
		bounties.slice(
			PAGE_SIZE * page,
			Math.min(bounties.length, PAGE_SIZE * (page + 1))
		);

	return (
		<>
			<Stack
				direction={{ base: 'column', lg: 'row' }}
				align="top"
				fontSize="sm"
				fontWeight="600"
				gridGap={{ lg: '8' }}
				mx={0}
			>
				{id ? (
					<Bounty bounty={bounties} />
				) : (
					<>
						<Filters
							status={status}
							setStatus={setStatus}
							search={search}
							setSearch={setSearch}
							lte={lte}
							setLte={setLte}
							gte={gte}
							setGte={setGte}
							sortBy={sortBy}
							setSortBy={setSortBy}
							sortAscending={sortAscending}
							setSortAscending={setSortAscending}
						/>
						<Flex direction="column">
							{(search || status) &&
							bounties &&
							paginatedBounties.length === 0 ? (
									<Stack
										mt={10}
										h="40"
										borderWidth={1}
										borderRadius={10}
										width={{ base: '100vw', lg: '700px' }}
										textalign="center"
										direction="row"
										justify="center"
										align="center"
									>
										<Text fontSize="lg">Found </Text>
										<Text fontSize="lg" fontFamily="mono" fontWeight="bold">
										0
										</Text>
										<Text fontSize="lg"> matching results</Text>
									</Stack>
								) : (
									<>
										<BountyList bounties={bounties} />
										{paginatedBounties === undefined ? <SkeletonLoader /> : null}
									</>
								)}
						</Flex>
					</>
				)}
			</Stack>
		</>
	);
};

export default Bounties;
