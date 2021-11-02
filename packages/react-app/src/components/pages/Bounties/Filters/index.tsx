import React, { useState } from 'react';
import {
	// Heading,
	// HStack,
	Input,
	InputGroup,
	InputLeftElement,
	// Select,
	Stack,
	// Switch,
	Flex,
	// Spacer,
	Box,
	useColorModeValue,
} from '@chakra-ui/react';
import { FaSearch, FaCaretDown } from 'react-icons/fa';

// import ColorModeButton from '../../../parts/ColorModeButton';

// import { discordSupportChannelUrl } from '../../../../constants/discordInfo';
// import { feedbackUrl } from '../../../../constants/discordInfo';

// import AccessibleLink from '../../../parts/AccessibleLink';
import bountyStatus from '../../../../constants/bountyStatus';

const SearchIcon = (): JSX.Element => (
	<Flex h="100%" display="flex" alignItems="center" pl="5" pt="2">
		<FaSearch size="1.2em" color={useColorModeValue('#57606a', '#8b949e')} />
	</Flex>
);

const SearchFilter = ({
	placeholder = 'Search',
	searchValue,
	setSearch,
	options,
	// status,
	setStatus,
}: {
	placeholder?: string;
	searchValue: string;
	setSearch: any;
	options: any;
	status: string;
	setStatus: any;
}): JSX.Element => {
	const [statusFilterIsOpen, setStatusFilterIsOpen] = useState(false);

	const updateSearchValue = (event: any): void => {
		setSearch(event.target.value);
	};

	return (
		<Flex h="12">
			<InputGroup>
				<InputLeftElement pointerEvents="none">
					<SearchIcon />
				</InputLeftElement>
				<Input
					h="100%"
					pl="14"
					fontSize="20"
					pt="1.5"
					borderLeftRadius="100"
					outline="none"
					boxShadow="none"
					_focus={{
						borderColor: 'gray.300',
					}}
					placeholder={placeholder}
					value={searchValue}
					onChange={updateSearchValue}
					autoFocus
				/>
			</InputGroup>
			<Box>
				<Flex
					h="100%"
					px="5"
					pt="1"
					borderRightRadius={100}
					borderWidth={1}
					alignItems="center"
					justify="center"
					fontSize="18"
					fontFamily="Calibre Bold"
					cursor="pointer"
					borderColor={statusFilterIsOpen ? 'gray.300' : 'inherit'}
					onClick={(): void => setStatusFilterIsOpen(!statusFilterIsOpen)}
				>
					All
					<Flex
						alignItems="center"
						justifyContent="center"
						h="100%"
						mt="-0.2em"
						pl="1.5"
					>
						<FaCaretDown size=".8em" />
					</Flex>
				</Flex>
				{statusFilterIsOpen ? (
					<Flex
						direction="column"
						justifyContent="center"
						position="absolute"
						top="3.8rem"
						right="0"
						bgColor={useColorModeValue('#FFF', '#121212')}
						borderRadius={8}
						borderWidth={1}
						py={2}
						cursor="pointer"
					>
						<Box
							position="absolute"
							top="0.05rem"
							right="1.3rem"
							w="3"
							h="3"
							mt="-2"
							bgColor={useColorModeValue('#FFF', '#121212')}
							borderTopWidth={1}
							borderLeftWidth={1}
							transform="rotate(45deg)"
							fontFamily="Calibre Bold"
						></Box>
						{options.map((status: any, key: any) => (
							<Flex
								key={key}
								h="10"
								fontSize="18"
								fontFamily="Calibre Bold"
								alignItems="center"
								pl="5"
								pr="10"
								pt="2"
								_hover={{
									bgColor: useColorModeValue('#FFF', '#424242'),
								}}
								onClick={(): void => setStatus(status.value)}
								onBlur={(): void => setStatusFilterIsOpen(false)}
							>
								{status.name}
							</Flex>
						))}
					</Flex>
				) : null}
			</Box>
		</Flex>
	);
};

// const SelectFilters = ({
// 	name,
// 	options,
// 	status,
// 	setStatus,
// }: {
//   name?: string;
//   options: { name: string; value: string }[];
//   status: string;
//   setStatus: (str: string) => any;
// }): JSX.Element => {
// 	const updateStatus = (event: any): void => {
// 		setStatus(event.target.value);
// 	};

// 	return (
// 		<>
// 			{name && <Heading size="xs">{name}</Heading>}
// 			<Select placeholder="All" mb="4" onChange={updateStatus} value={status}>
// 				{options.map((option: { name: string; value: string }) => (
// 					<option key={option.name} value={option.value}>
// 						{option.value}
// 					</option>
// 				))}
// 			</Select>
// 		</>
// 	);
// };

// const SortBy = ({
// 	name,
// 	options,
// 	sortBy,
// 	sortAscending,
// 	setSortBy,
// 	setSortAscending,
// }: {
//   name?: string;
//   options: { name: string; value: string }[];
//   sortBy: string;
//   setSortBy: (str: string) => any;
//   sortAscending: boolean;
//   setSortAscending: (bool: boolean) => any;
// }): JSX.Element => {
// 	const updateSort = (event: any): void => {
// 		setSortBy(event.target.value);
// 	};
// 	const toggleSortAscending = (_: any): void => {
// 		setSortAscending((sortAscending = !sortAscending));
// 	};

// 	return (
// 		<>
// 			<Flex className="composite-heading" alignItems="center">
// 				{name && (
// 					<Heading size="xs" mb="0">
// 						{name}
// 					</Heading>
// 				)}
// 				<Spacer />
// 				<Flex className="switch" alignItems="center">
// 					<Heading size="xs" mr="3" mb="0">
// 						{sortAscending ? 'Ascending' : 'Descending'}
// 					</Heading>
// 					<Switch
// 						onChange={toggleSortAscending}
// 						defaultChecked
// 						isChecked={sortAscending}
// 					/>
// 				</Flex>
// 			</Flex>
// 			<Select onChange={updateSort} value={sortBy}>
// 				{options.map((option: { name: string; value: string }) => (
// 					<option key={option.name} value={option.value}>
// 						{option.value}
// 					</option>
// 				))}
// 			</Select>
// 		</>
// 	);
// };

// const MinMaxFilter = ({
// 	name,
// 	setLte,
// 	setGte,
// }: {
//   name?: string;
//   lte: number;
//   setLte: any;
//   gte: number;
//   setGte: any;
// }): JSX.Element => {
// 	const updateMin = (event: any): void => {
// 		setGte(event.target.value);
// 	};
// 	const updateMax = (event: any): void => {
// 		setLte(event.target.value);
// 	};

// 	return (
// 		<>
// 			{name && <Heading size="xs">{name}</Heading>}
// 			<HStack my="2">
// 				<Input placeholder="Min" onChange={updateMin} />
// 				<Input placeholder="Max" onChange={updateMax} />
// 			</HStack>
// 		</>
// 	);
// };

// const HelpLinks = (): JSX.Element => (
// 	<HStack>
// 		<AccessibleLink href={discordSupportChannelUrl} isExternal={true}>
// 			<ColorModeButton>Give us Feedback</ColorModeButton>
// 		</AccessibleLink>

// 		<AccessibleLink href={feedbackUrl} isExternal={true}>
// 			<ColorModeButton>Need Help?</ColorModeButton>
// 		</AccessibleLink>
// 	</HStack>
// );

const Filters = (props: {
	status: string;
	setStatus: any;
	search: string;
	setSearch: any;
	lte: number;
	setLte: any;
	gte: number;
	setGte: any;
	sortBy: string;
	setSortBy: any;
	sortAscending: boolean;
	setSortAscending: any;
}): JSX.Element => {
	const filterStatusList = [
		{
			name: 'All',
			value: 'All',
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
		<Stack
			w="100%"
			py={5}
			pt={{ base: 5, lg: 10 }}
			borderBottomWidth={{ base: 1, lg: 0 }}
		>
			<Stack
				position={{ lg: 'sticky' }}
				top={{ lg: '6.5rem' }}
				width={{ base: '90%', lg: 350 }}
				mx="auto"
			>
				<SearchFilter
					searchValue={props.search}
					setSearch={props.setSearch}
					options={filterStatusList}
					status={props.status}
					setStatus={props.setStatus}
				/>
				{/* <SelectFilters
          name="Filter Status"
          options={filterStatusList}
          status={props.status}
          setStatus={props.setStatus}
        />
        <MinMaxFilter
          name="Filter Bounty Value"
          lte={props.lte}
          setLte={props.setLte}
          gte={props.gte}
          setGte={props.setGte}
        />
        <SortBy
          name="Sort By"
          options={[{ name: "reward", value: "Reward" }]}
          sortBy={props.sortBy}
          setSortBy={props.setSortBy}
          sortAscending={props.sortAscending}
          setSortAscending={props.setSortAscending}
        /> */}
				{/* <SelectFilters name="Filter Guilds" options={placeholderOptions} /> */}
				{/* <SelectFilters name="Group By" options={placeholderOptions} /> */}
			</Stack>
		</Stack>
	);
};

export default Filters;
