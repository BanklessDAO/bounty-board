import {
	Heading,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Stack,
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

// const MinMaxFilter = ({ name }: { name?: string }): JSX.Element => (
// 	<>
// 		{name && <Heading size="xs">{name}</Heading>}
// 		<HStack my="2">
// 			<Input placeholder="Min" />
// 			<Input placeholder="Max" />
// 		</HStack>
// 	</>
// );

const HelpLinks = (): JSX.Element => (
	<HStack>
		<AccessibleLink href={discordSupportChannelUrl} isExternal={true}>
			<ColorModeButton>Give us Feedback</ColorModeButton>
		</AccessibleLink>

		<AccessibleLink href={feedbackUrl} isExternal={true}>
			<ColorModeButton>Need Help?</ColorModeButton>
		</AccessibleLink>
	</HStack>
);

const Filters = (props: { status: string, setStatus: any, search: string, setSearch: any }): JSX.Element => {
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
				<SearchFilter searchValue={props.search} setSearch={props.setSearch}/>
				{/* <SelectFilters name="Filter Guilds" options={placeholderOptions} /> */}
				<SelectFilters name="Filter Status" options={filterStatusList} status={props.status} setStatus={props.setStatus} />
				{/* <MinMaxFilter name="Filter Bounty Value" /> */}
				{/* <SelectFilters name="Sort By" options={placeholderOptions} /> */}
				{/* <SelectFilters name="Group By" options={placeholderOptions} /> */}
			</Stack>
			<HelpLinks />
		</Stack>
	);
};

export default Filters;
