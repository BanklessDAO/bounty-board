import { Stack, Text, VStack, Button, useDisclosure } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import BountyList from './BountyList';
import React, { useMemo, useEffect, useState, useRef } from 'react';
import MarkPaidModal from './Form/MarkPaidModal';
import Filters from './Filters';
import useBounties from '@app/hooks/useBounties';
import { BountyCollection } from '@app/models/Bounty';
import BountyPaginate from './Filters/bountyPaginate';
import { CSVLink } from 'react-csv';
import { BOUNTY_EXPORT_ITEMS } from '../../../constants/bountyExportItems';
import miscUtils from '../../../utils/miscUtils';
import { useRouter } from 'next/router';
import { FilterParams } from '@app/types/Filter';
import {
	baseFilters,
	filtersDefined,
	getFiltersFromUrl,
	useDynamicUrl,
} from '@app/hooks/useUrlFilters';
import { useUser } from '@app/hooks/useUser';
import { useRoles } from '@app/hooks/useRoles';

import SavedQueriesMenu from './Filters/SavedQueriesMenu';
import ServiceUtils from '@app/utils/ServiceUtils';

export const PAGE_SIZE = 10;

type SetState<T extends any> = (arg: T) => void;

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

const SelectExport = ({
	bounties,
	selectedBounties,
	setSelectedBounties,
	setMarkedSomePaid,
}: {
  bounties: BountyCollection[] | undefined;
  selectedBounties: string[];
  setSelectedBounties: SetState<string[]>;
  setMarkedSomePaid: SetState<boolean>;
}): JSX.Element => {
	const { colorMode } = useColorMode();
	const roles = useRoles();
	const { user } = useUser();
	const [getCsvData, setCsvData] = miscUtils.useStateCallback<
    Record<string, unknown>[]
  >([]);
	const [getBountiesToMark, setBountiesToMark] = useState<string[]>([]);
	const [getMarkPaidMessage, setMarkPaidMessage] = useState<string>('');
	const csvLink = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);
	const {
		isOpen: isMarkPaidOpen,
		onOpen: onMarkPaidOpen,
		onClose: onMarkPaidClose,
	} = useDisclosure();

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
			const csvData = bounties
				.filter(({ _id }) => selectedBounties.includes(_id))
				.map(miscUtils.csvEncode);

			setCsvData(csvData, () => {
				csvLink?.current?.link.click();
			});
			if (user && roles) {
				let bountiesToMark: string[] = [];
				// If Admin, allow all to be marked, otherwise only own bounties and if correct permissions
				if (roles.some((r: string) => ['admin'].includes(r))) {
					bountiesToMark = selectedBounties.filter((_id) => {
						const bounty = bounties?.find((b) => b._id == _id);
						return bounty && ServiceUtils.canBePaid({ bounty });
					});
					setMarkPaidMessage('Mark exported claimed bounties as paid?');
				} else if (
					roles.some((r: string) =>
						['edit-bounties', 'edit-own-bounty'].includes(r)
					)
				) {
					bountiesToMark = selectedBounties.filter((_id) => {
						const bounty = bounties?.find((b) => b._id == _id);
						return bounty && (bounty.createdBy.discordId == user.id) && ServiceUtils.canBePaid({ bounty });
					});
					setMarkPaidMessage('Mark exported claimed bounties you created as paid?');
				}
				if (bountiesToMark.length > 0) {
					setBountiesToMark(bountiesToMark);
					onMarkPaidOpen();
				}
			}
		}
	};

	return (
		<Stack justify="space-between" direction="row" mt={1}>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == bounties.length}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleSelectAll}>
                Select All
			</Button>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == 0}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleClearAll}>
                Clear All
			</Button>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == 0}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleCSV}>
                Export
			</Button>
			<CSVLink
				data={getCsvData}
				headers={BOUNTY_EXPORT_ITEMS}
				filename="bounties.csv"
				className="hidden"
				ref={csvLink}
				target="_blank"/>
			<MarkPaidModal
				isOpen={isMarkPaidOpen}
				onClose={onMarkPaidClose}
				bounties={
					bounties
						? bounties.filter(({ _id }) => getBountiesToMark.includes(_id))
						: undefined
				}
				setMarkedSomePaid={setMarkedSomePaid}
				markPaidMessage={getMarkPaidMessage}
			/>
		</Stack>
	);
};

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
			(filters.search || filters.status) &&
        bounties &&
        paginatedBounties.length === 0
		);
		return { paginatedBounties, noResults };
	}, [bounties, page, PAGE_SIZE, filters.status, filters.search]);
};

const Bounties = (): JSX.Element => {
	/* Bounties will fetch all data to start, unless a single bounty is requested */
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [filters, setFilters] = useState<FilterParams>(baseFilters);
	const [selectedBounties, setSelectedBounties] = useState<string[]>([]);
	const [markedSomePaid, setMarkedSomePaid] = useState(false);

	// Watch this only runs on page load once the params are instantiated
	// otherwise you will lose filers and/or create inf loop
	// only render the saved search the first time, to prevent loops
	const firstLoad = useRef(true);
	const urlQuery = useDynamicUrl(
		filters,
		markedSomePaid,
		router.isReady && !firstLoad.current
	);

	useEffect(() => {
		if (!router.isReady) return;

		const asPathWithoutLeadinggSlash = router.asPath.replace(/\//, '');
		if (
			(firstLoad.current && filtersDefined(router.query)) ||
      (!firstLoad.current &&
        Object.keys(router.query).length > 0 &&
        asPathWithoutLeadinggSlash !== urlQuery)
		) {
			const newFilters = getFiltersFromUrl({ ...baseFilters, ...router.query });
			setFilters(newFilters);
			firstLoad.current = false;
		}
	}, [router.isReady, router.query, firstLoad]);

	useEffect(() => {
		if (router.isReady) {
			router.push(urlQuery, undefined, { shallow: true });
		}
	}, [urlQuery, router.isReady]);

	const { bounties, isLoading, isError } = useBounties(
		'/api/bounties' + urlQuery,
		router.isReady
	);
	const { paginatedBounties, noResults } = usePaginatedBounties(
		bounties,
		page,
		filters
	);

	useEffect(() => {
		setPage(0);
	}, [filters]);

	return (
		<>
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
						<Filters filters={filters} setFilters={setFilters} />
						<SelectExport
							bounties={bounties}
							selectedBounties={selectedBounties}
							setSelectedBounties={setSelectedBounties}
							setMarkedSomePaid={setMarkedSomePaid}/>
					</VStack>

					{isError || noResults ? (
						<FilterResultPlaceholder message={'No Results'} />
					) : isLoading ? (
						<FilterResultPlaceholder message={'Loading'} />
					) : (
						<BountyList
							bounties={paginatedBounties}
							selectedBounties={selectedBounties}
							setSelectedBounties={setSelectedBounties}/>
					)}
					<BountyPaginate
						page={page}
						setPage={setPage}
						maxPages={maxPages(bounties)}/>
				</Stack>
			</Stack>
		</>
	);
};

export default Bounties;
