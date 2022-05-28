import {
	Checkbox,
	Heading,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Stack,
	Switch,
	Flex,
	Spacer,
	useCheckboxGroup,
	Button,
	useColorMode,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import bountyStatus from '@app/constants/bountyStatus';
import paidStatus from '@app/constants/paidStatus';
import { AcceptedSortInputs, FilterParams, UseFilterState } from '@app/types/Filter';
import React, { useMemo, useState } from 'react';
import { useUser } from '@app/hooks/useUser';
import { CheckboxCard } from '@app/components/parts/SelectButton';
import SaveSearchModal from './SaveSearchModal';


type SetState<T extends any> = (arg: T) => void;
type Event = React.ChangeEvent<HTMLInputElement>

const sortOptions: { name: string, value: AcceptedSortInputs }[] = [
	{
		name: 'Created Date', value: 'createdAt',
	},
	{
		name: 'Reward', value: 'reward',
	},
	{
		name: 'Bounty Status', value: 'status',
	},
	{
		name: 'Paid Status', value: 'paidStatus',
	},
];

const SearchIcon = ({ color }: { color: string }): JSX.Element => (
	<FaSearch color={color} />
);

const SearchFilter = ({
	placeholder = 'Search',
	filters, setFilters,
}: {
	placeholder?: string
} & UseFilterState): JSX.Element => {

	const updateSearchValue = (event: Event): void => {
		setFilters({
			...filters,
			search: event.target.value,
		});
	};

	return (
		<InputGroup>
			<InputLeftElement pointerEvents="none">
				<SearchIcon color="gray.300" />
			</InputLeftElement>
			<Input placeholder={placeholder} value={filters.search ?? ''} onChange={updateSearchValue} autoFocus />
		</InputGroup>
	);
};

const SelectFilters = ({ options,
	filters, setFilters,
}: {
	name?: string
	options: { name: string; value: string }[],
} & UseFilterState): JSX.Element => {

	const updateStatus = (value: string[]): void => {
		setFilters({
			...filters,
			status: value,
		});
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { getCheckboxProps } = useCheckboxGroup({
		value: filters.status || [],
		onChange: updateStatus,
	});
	
	return (
		<Flex wrap={'wrap'}>
			{options.map((option: { name: string; value: string }) => (
				<CheckboxCard key={option.value} {...getCheckboxProps({ value: option.value })} />
			))}
		</Flex>
	);
};

const SortBy = ({ name, options, filters, setFilters }: {
	name?: string
	options: { name: string; value: string }[],
} & UseFilterState): JSX.Element => {

	const updateSort = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		setFilters({
			...filters,
			sortBy: event.target.value,
		});
	};
	const toggleSortAscending = (): void => {
		setFilters({
			...filters,
			asc: !booleanAsc,
		});
	};

	const booleanAsc = useMemo((): boolean => {
		// string queries will return `'false'` as `true`
		if (filters.asc === 'false') return false;
		// technically do not need this line
		else if (filters.asc === 'true') return true;
		else return Boolean(filters.asc);
	}, [filters.asc]);

	return (
		<Flex className="composite-heading" >
			<Flex className="sort-by" alignItems={'baseline'}>
				{name && <Heading size="xs" mb="0" width={'80px'}>{name}</Heading>}
				<Spacer />
				<Select onChange={updateSort} value={filters.sortBy}>
					{options.map((option: { name: string; value: string }) => (
						<option key={option.name} value={option.value}>
							{option.name}
						</option>
					))}
				</Select>
			</Flex>
			<Spacer minWidth={3} />
			<Flex className="switch" alignItems="center">
				<Heading className="single-head" size="xs" mr="3" mb="0">
					{ filters.asc ? 'Ascending' : 'Descending' }
				</Heading>
				<Heading size="xs" mr="3" mb="0" className="multi-head">
					Ascending
				</Heading>
				<Switch
					colorScheme="primary"
					onChange={toggleSortAscending}
					defaultChecked
					isChecked={!booleanAsc}
				/>
				<Heading size="xs" ml="3" mb="0" className="multi-head">
					Descending
				</Heading>
			</Flex>
		</Flex>
	);
};

const MyBountiesFilter = ({ name, filters, setFilters }: {
	name?: string
} & UseFilterState): JSX.Element => {

	const { user } = useUser();

	const [claimedByMe, setClaimedByMe] = useState(false);
	const [createdByMe, setCreatedByMe] = useState(false);

	type CheckEvent = React.ChangeEvent<HTMLInputElement>;

	const updateClaimedByMe = (event: CheckEvent): void => {
		const { checked } = event.target;
		if (checked && user) {
			setFilters({
				...filters,
				claimedBy: user.id,
			});
		} else {
			const { claimedBy, ...filtersNoClaimedBy } = filters; claimedBy;
			setFilters(filtersNoClaimedBy);
		}
		setClaimedByMe(checked);
	};
	const updateCreatedByMe = (event: CheckEvent): void => {
		const { checked } = event.target;
		if (checked && user) {
			setFilters({
				...filters,
				createdBy: user.id,
			});
		} else {
			const { createdBy, ...filtersNoCreatedBy } = filters; createdBy;
			setFilters(filtersNoCreatedBy);
		}
		setCreatedByMe(checked);
	};

	return (
		<>
			{user && <Flex className="composite-heading" alignItems="center">
				{name && <Heading size="xs" mb="0">{name}</Heading>}
				<Flex className="checkbox" w='100%' alignItems="center" justifyContent={'space-around'} h={'40px'}>
					<Checkbox
						size="sm"
						colorScheme="primary"
						onChange={updateClaimedByMe}
						isChecked={claimedByMe}
					>
						Claimed By Me
					</Checkbox>
					<Checkbox
						size="sm"
						colorScheme="primary"
						onChange={updateCreatedByMe}
						isChecked={createdByMe}
					>
						Created By Me
					</Checkbox>
				</Flex>
			</Flex>}
		</>
	);
};

const PaidFilter = ({ options, filters, setFilters }: {
	name?: string,
	options: { name: string; value: string }[],
} & UseFilterState): JSX.Element => {
	const updatePaidStatus = (value: string[]): void => {
		setFilters({
			...filters,
			paidStatus: value,
		});
	};

	const { getCheckboxProps } = useCheckboxGroup({
		value: filters.paidStatus || [],
		onChange: updatePaidStatus,
	});

	return (
		<>
			<Flex>
				{options.map((option: { name: string; value: string }) => (
					<CheckboxCard key={option.value} {...getCheckboxProps({ value: option.value })} />
				))}
			</Flex>
		</>
	);

};

const MinMaxFilter = ({ filters, setFilters }: {
	name?: string,
} & UseFilterState): JSX.Element => {
	const updateMin = (event: Event): void => {
		setFilters({
			...filters,
			gte: Number(event.target.value),
		});
	};
	const updateMax = (event: Event): void => {
		setFilters({
			...filters,
			lte: Number(event.target.value),
		});
	};

	return (
		<>
			{/* {name && <Heading size="xs">{name}</Heading>} */}
			<HStack my="2">
				<Input placeholder="Min Bounty Value" onChange={updateMin} />
				<Input placeholder="Max Bounty Value" onChange={updateMax} />
			</HStack>
		</>
	);
};

const SaveFilter = ({ filters }: {filters: FilterParams}): JSX.Element => {
	const { colorMode } = useColorMode();
	const [showModal, setShowModal] = useState(false);
	const { user } = useUser();
	
	const handleSaveFilter = () => {
		setShowModal(true);
	};

	if (!user) return <></>;

	return <>
		<Button
			p={5}
			size="xs"
			bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
			onClick={handleSaveFilter} mr="2">
			Save this Search
		</Button>
		<SaveSearchModal onClose={() => setShowModal(false)} isOpen={showModal} filters={filters} discordId={user.id}/>
	</>;
};

const Filters = (props: {
	filters: FilterParams,
	setFilters: SetState<FilterParams>
}): JSX.Element => {
	const filterStatusList = [
		{
			name: bountyStatus.OPEN,
			value: bountyStatus.OPEN,
		},
		{
			name: bountyStatus.IN_PROGRESS,
			value: bountyStatus.IN_PROGRESS,
		},
		{
			name: bountyStatus.IN_REVIEW,
			value: bountyStatus.IN_REVIEW,
		},
		{
			name: bountyStatus.COMPLETED,
			value: bountyStatus.COMPLETED,
		},
	];

	const filterPaidStatusList = [
		{
			name: paidStatus.PAID,
			value: paidStatus.PAID,
		},
		{
			name: paidStatus.UNPAID,
			value: paidStatus.UNPAID,
		},
	];
	return (
		<Stack width={{ base: '100%', lg: '70vw' }} >
			<Stack borderWidth={3} width={'100%'} borderRadius={10} px={3} py={5} mb={3} direction={{ base: 'column', lg: 'row' }}>
				<Stack px={2} flexGrow={1}>
					<Stack direction={{ base: 'row' }} justifyContent={'space-between'}>
						<SelectFilters
							name="Filter Status"
							options={filterStatusList}
							filters={props.filters}
							setFilters={props.setFilters}
						/>
						<PaidFilter
							name="Filter by Paid"
							options={filterPaidStatusList}
							filters={props.filters}
							setFilters={props.setFilters}
						/>
					</Stack>
					<MyBountiesFilter
						filters={props.filters}
						setFilters={props.setFilters}
					/>
					<SortBy
						name="Sort By"
						options={sortOptions}
						filters={props.filters}
						setFilters={props.setFilters}
					/>
				</Stack>
				<Stack px={2} flexGrow={1}>
					<SearchFilter
						filters={props.filters}
						setFilters={props.setFilters}
					/>
					<MinMaxFilter
						name="Filter Bounty Value"
						filters={props.filters}
						setFilters={props.setFilters}
					/>
					<SaveFilter
						filters={props.filters}
					/>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Filters;
