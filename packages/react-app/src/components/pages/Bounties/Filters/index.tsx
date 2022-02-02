import {
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
import { AcceptedSortInputs } from '@app/types/Filter';

type SetState<T extends any> = (arg: T) => void;

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
	searchValue,
	setSearch,
}: {
	placeholder?: string
	searchValue: string,
	setSearch: SetState<string>
}): JSX.Element => {

	const updateSearchValue = (event: any): void => {
		setSearch(event.target.value);
	};

	return (
		<InputGroup>
			<InputLeftElement pointerEvents="none">
				<SearchIcon color="gray.300" />
			</InputLeftElement>
			<Input placeholder={placeholder} mb={4} value={searchValue} onChange={updateSearchValue} autoFocus/>
		</InputGroup>
	);
};

const SelectFilters = ({ name, options, status, setStatus }: {
	name?: string
	options: { name: string; value: string }[],
	status: string,
	setStatus: SetState<string>,
}): JSX.Element => {

	const updateStatus = (event: any): void => {
		setStatus(event.target.value);
	};

	return (
		<>
			{name && <Heading size="xs">{name}</Heading>}
			<Select placeholder="All" mb="4" onChange={updateStatus} value={status}>
				{options.map((option: { name: string; value: string }) => (
					<option key={option.name} value={option.value}>
						{option.value}
					</option>
				))}
			</Select>
		</>
	);
};

const SortBy = ({ name, options, sortBy, sortAscending, setSortBy, setSortAscending }: {
	name?: string
	options: { name: string; value: string }[],
	sortBy: string,
	setSortBy: SetState<string>,
	sortAscending: boolean,
	setSortAscending: SetState<boolean>,
}): JSX.Element => {

	const updateSort = (event: any): void => {
		setSortBy(event.target.value);
	};
	const toggleSortAscending = (_: any): void => {
		setSortAscending(sortAscending = !sortAscending);
	};
	return (
		<>
			<Flex className="composite-heading" alignItems="center">
				{name && <Heading size="xs" mb="0">{name}</Heading>}
				<Spacer />
				<Flex className="switch" alignItems="center">
					<Heading size="xs" mr="3" mb="0">
						{sortAscending ? 'Ascending' : 'Descending'}
					</Heading>
					<Switch
						colorScheme="primary"
						onChange={toggleSortAscending}
						defaultChecked
						isChecked={sortAscending}
					/>
				</Flex>
			</Flex>
			<Select mb="4" onChange={updateSort} value={sortBy}>
				{options.map((option: { name: string; value: string }) => (
					<option key={option.name} value={option.value}>
						{option.name}
					</option>
				))}
			</Select>
		</>
	);
};

const MinMaxFilter = ({ name, setLte, setGte }: {
	name?: string,
	lte: number,
	setLte: SetState<number>,
	gte: number,
	setGte: SetState<number>
}): JSX.Element => {
	const updateMin = (event: any): void => {
		setGte(event.target.value);
	};
	const updateMax = (event: any): void => {
		setLte(event.target.value);
	};
	
	return (
		<>
			{name && <Heading size="xs">{name}</Heading>}
			<HStack my="2">
				<Input placeholder="Min" onChange={updateMin}/>
				<Input placeholder="Max" onChange={updateMax}/>
			</HStack>
		</>
	);
};

const Filters = (props: {
	status: string,
	setStatus: SetState<string>,
	search: string,
	setSearch: SetState<string>
	lte: number,
	setLte: SetState<number>,
	gte: number,
	setGte: SetState<number>,
	sortBy: string,
	setSortBy: SetState<string>,
	sortAscending: boolean,
	setSortAscending: SetState<boolean>,
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
			<Stack borderWidth={3} borderRadius={10} px={5} py={5} mb={8}>
				<SearchFilter
					searchValue={props.search}
					setSearch={props.setSearch}
				/>
				<SelectFilters
					name="Filter Status"
					options={filterStatusList}
					status={props.status}
					setStatus={props.setStatus}
				/>
				<MinMaxFilter
					name="Filter Bounty Value"
					lte={props.lte} setLte={props.setLte}
					gte={props.gte} setGte={props.setGte}
				/>
				<SortBy
					name="Sort By"
					options={sortOptions}
					sortBy={props.sortBy}
					setSortBy={props.setSortBy}
					sortAscending={props.sortAscending}
					setSortAscending={props.setSortAscending}
				/>
			</Stack>
		</Stack>
	);
};

export default Filters;
