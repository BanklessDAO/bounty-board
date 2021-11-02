import { Stack, Text } from '@chakra-ui/react';
import BountyAccordion from './BountyAccordion';
import useSWR from 'swr';
import { BountyCard } from './Bounty';
import React, { useEffect, useState } from 'react';
import Filters from './Filters';
import useDebounce from '../../../hooks/useDebounce';

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
	const [status, setStatus] = useState('');
	const [search, setSearch] = useState('');
	const [gte, setGte] = useState(0);
	// how to handle the lte === 0 case?
	const [lte, setLte] = useState(Infinity);
	const [sortBy, setSortBy] = useState('');
	const [sortAscending, setSortAscending] = useState(true);
	const debounceSearch = useDebounce(search, 500, true);

	// const maxPages = () => {
	// 	if (!bounties) return 0;
	// 	const numFullPages = Math.floor(bounties.length / PAGE_SIZE);
	// 	const hasExtraPage = bounties.length % PAGE_SIZE != 0;
	// 	return hasExtraPage ? numFullPages + 1 : numFullPages;
	// };

	// const incrementPage = () => {
	// 	// pages are 0 indexed
	// 	setPage(Math.min(page + 1, maxPages() - 1));

	// 	window.scrollTo(0, 0);
	// };

	// const decrementPage = () => {
	// 	setPage(Math.max(page - 1, 0));
	// 	window.scrollTo(0, 0);
	// };

	const { data: bounties, error } = useSWR(
		id
			? `/api/bounties/${id}`
			: `/api/bounties?status=${status}&search=${debounceSearch}&lte=${lte}&gte=${gte}&sortBy=${sortBy}&asc=${sortAscending}`,
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
				gridGap={{ lg: '10' }}
			>
				{id ? (
					<BountyCard {...bounties} />
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
						{(search || status) &&
						bounties &&
						paginatedBounties.length === 0 ? (
								<Stack
									borderWidth={1}
									borderRadius={10}
									width={{ base: '95vw', lg: '700px' }}
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
								<BountyAccordion bounties={paginatedBounties} />
							)}
					</>
				)}
			</Stack>
			{!id && (
				<Stack h="40" justify="space-between" direction="row" mt={3}>
					{/* <Box ml={5} bg="#FFF">
            <Box borderRadius={5} w="60" h={5}></Box>
            <Box pt={1} borderRadius={5} w="60" h={5}></Box>
          </Box> */}
					{/* <Button
            p={5}
            disabled={page === 0}
            size="sm"
            colorScheme="teal"
            onClick={decrementPage}
          >
            &larr; Previous Page
          </Button>
          <Button
            p={5}
            disabled={
              page === maxPages() - 1 ||
              (bounties && paginatedBounties.length === 0)
            }
            size="sm"
            colorScheme="teal"
            onClick={incrementPage}
          >
            Next Page &rarr;
          </Button> */}
				</Stack>
			)}
		</>
	);
};

export default Bounties;
