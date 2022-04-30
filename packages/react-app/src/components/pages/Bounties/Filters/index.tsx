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
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import bountyStatus from '@app/constants/bountyStatus';
import { AcceptedSortInputs, FilterParams, UseFilterState } from '@app/types/Filter';
import React, { useMemo, useState } from 'react';
import { useUser } from '@app/hooks/useUser';


type SetState<T extends any> = (arg: T) => void;
type Event = React.ChangeEvent<HTMLInputElement>

const sortOptions: { name: string, value: AcceptedSortInputs }[] = [
	{
		name: 'Created Date', value: 'createdAt',
	},
	{
		name: 'Reward', value: 'reward',
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
			<Input placeholder={placeholder} mb={4} value={filters.search ?? ''} onChange={updateSearchValue} autoFocus />
		</InputGroup>
	);
};

const SelectFilters = ({ name, options,
	filters, setFilters,
}: {
	name?: string
	options: { name: string; value: string }[],
} & UseFilterState): JSX.Element => {

	const updateStatus = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		setFilters({
			...filters,
			status: event.target.value,
		});
	};
	return (
		<>
			{name && <Heading size="xs">{name}</Heading>}
			<Select placeholder="All" mb="4" onChange={updateStatus} value={filters.status}>
				{options.map((option: { name: string; value: string }) => (
					<option key={option.name} value={option.value}>
						{option.value}
					</option>
				))}
			</Select>
		</>
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
		<>
			<Flex className="composite-heading" alignItems="center">
				{name && <Heading size="xs" mb="0">{name}</Heading>}
				<Spacer />
				<Flex className="switch" alignItems="center">
					<Heading size="xs" mr="3" mb="0">
						{filters.asc ? 'Ascending' : 'Descending'}
					</Heading>
					<Switch
						colorScheme="primary"
						onChange={toggleSortAscending}
						defaultChecked
						isChecked={booleanAsc}
					/>
				</Flex>
			</Flex>
			<Select mb="4" onChange={updateSort} value={filters.sortBy}>
				{options.map((option: { name: string; value: string }) => (
					<option key={option.name} value={option.value}>
						{option.name}
					</option>
				))}
			</Select>
		</>
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
				<Flex className="checkbox" w='100%' alignItems="center">
					<Checkbox
						size="sm"
						colorScheme="primary"
						onChange={updateClaimedByMe}
						isChecked={claimedByMe}
					>
						Claimed By Me
					</Checkbox>
					<Spacer />
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

const MinMaxFilter = ({ name, filters, setFilters }: {
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
			{name && <Heading size="xs">{name}</Heading>}
			<HStack my="2">
				<Input placeholder="Min" onChange={updateMin} />
				<Input placeholder="Max" onChange={updateMax} />
			</HStack>
		</>
	);
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
	return (
		<Stack width={{ base: '100%', lg: 300 }}>
			<Stack borderWidth={3} borderRadius={10} px={5} py={5} mb={3}>
				<SearchFilter
					filters={props.filters}
					setFilters={props.setFilters}
				/>
				<SelectFilters
					name="Filter Status"
					options={filterStatusList}
					filters={props.filters}
					setFilters={props.setFilters}
				/>
				<MyBountiesFilter
					filters={props.filters}
					setFilters={props.setFilters}
				/>
				<MinMaxFilter
					name="Filter Bounty Value"
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
		</Stack>
	);
};

export default Filters;
