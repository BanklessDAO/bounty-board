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

import ColorModeButton from '../../../parts/ColorModeButton';

import { discordSupportChannelUrl } from '../../../../constants/discordInfo';
import { feedbackUrl } from '../../../../constants/discordInfo';

import AccessibleLink from '../../../parts/AccessibleLink';
import bountyStatus from '../../../../constants/bountyStatus';

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
	setSearch: any
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
	setStatus: ((str: string) => any),
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
	setSortBy: ((str: string) => any),
	sortAscending: boolean,
	setSortAscending: ((bool: boolean) => any),
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
						{option.value}
					</option>
				))}
			</Select>
		</>
	);
};

const MinMaxFilter = ({ name, setLte, setGte }: {
	name?: string,
	lte: number,
	setLte: any,
	gte: number,
	setGte: any
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

const HelpLinks = (): JSX.Element => (
	<HStack>
		<AccessibleLink href={feedbackUrl} isExternal={true}>
			<ColorModeButton>Give us Feedback</ColorModeButton>
		</AccessibleLink>

		<AccessibleLink href={discordSupportChannelUrl} isExternal={true}>
			<ColorModeButton>Need Help?</ColorModeButton>
		</AccessibleLink>
	</HStack>
);

const Filters = (props: {
	status: string,
	setStatus: any,
	search: string,
	setSearch: any
	lte: number,
	setLte: any,
	gte: number,
	setGte: any,
	sortBy: string,
	setSortBy: any,
	sortAscending: boolean,
	setSortAscending: any,
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
					options={[{ name: 'reward', value: 'Reward' }]}
					sortBy={props.sortBy}
					setSortBy={props.setSortBy}
					sortAscending={props.sortAscending}
					setSortAscending={props.setSortAscending}
				/>
				{/* <SelectFilters name="Filter Guilds" options={placeholderOptions} /> */}
				{/* <SelectFilters name="Group By" options={placeholderOptions} /> */}
			</Stack>
			<HelpLinks />
		</Stack>
	);
};

export default Filters;
