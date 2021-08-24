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
}: {
  placeholder?: string
}): JSX.Element => (
	<InputGroup>
		<InputLeftElement pointerEvents="none">
			<SearchIcon color="gray.300" />
		</InputLeftElement>
		<Input placeholder={placeholder} mb={4} />
	</InputGroup>
);

const SelectFilters = ({ name, options }: {
  name?: string
  options: { name: string; value: string }[]
}): JSX.Element => (
	<>
		{name && <Heading size="xs">{name}</Heading>}
		<Select placeholder="All" mb="4">
			{options.map((option) => (
				<option key={option.name} value={option.value}>
					{option.value}
				</option>
			))}
		</Select>
	</>
);

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

const Home = (): JSX.Element => {
	// const placeholderOptions = [
	// 	{
	// 		name: 'Option 1',
	// 		value: 'option1',
	// 	},
	// 	{
	// 		name: 'Option 2',
	// 		value: 'option2',
	// 	},
	// 	{
	// 		name: 'Option 3',
	// 		value: 'option3',
	// 	},
	// ];
	const filterStatusList = [
		{
			name: bountyStatus.DRAFT,
			value: bountyStatus.DRAFT,
		},
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
				<SearchFilter />
				{/* <SelectFilters name="Filter Guilds" options={placeholderOptions} /> */}
				<SelectFilters name="Filter Status" options={filterStatusList} />
				{/* <MinMaxFilter name="Filter Bounty Value" /> */}
				{/* <SelectFilters name="Sort By" options={placeholderOptions} /> */}
				{/* <SelectFilters name="Group By" options={placeholderOptions} /> */}
			</Stack>
			<HelpLinks />
		</Stack>
	);
};

export default Home;
