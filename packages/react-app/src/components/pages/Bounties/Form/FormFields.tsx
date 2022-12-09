import { Controller, UseFormReturn } from 'react-hook-form';
import React from 'react';
import DatePicker from '@app/components/parts/DatePicker';
import { CreatableSelect, OptionBase, GroupBase } from 'chakra-react-select';
import {
	FormLabel,
	FormControl,
	Input,
	FormErrorMessage,
	Select,
	Flex,
	FormControlProps,
	Textarea,
	useColorMode,
	Box,
	BorderProps,
} from '@chakra-ui/react';
import {
	dateIsNotInPast,
	required,
	validNonNegativeDecimal,
} from '@app/utils/formUtils';
import ALLOWED_CURRENCIES from '@app/constants/currency';
import { useTags } from '@app/hooks/useTags';

const useCurrencies = (): string[] => {
	return ALLOWED_CURRENCIES;
};

const PLACEHOLDERS = {
	TITLE: 'Example: Create new Logo',
	DESCRIPTION:
    'Example: We need someone to create some snappy looking logos for our new Web3 project.',
	CRITERIA: 'Example: SVG and PNG images approved by the team',
	TAGS: 'Example: L1, Marketing, Dev',
};

export const bountyFormFieldValues : {
	title: string,
	description: string,
	reward: string,
	currency: string,
	criteria: string,
	dueAt: string,
	tags : string[] } = {
		title: '',
		description: '',
		reward: '1000',
		currency: ALLOWED_CURRENCIES[0],
		criteria: '',
		dueAt: new Date().toISOString(),
		tags: [],
	};

interface TagOption extends OptionBase {
	label: string;
	value: string;
  }
const TagInput = ({ options, borderProps }: {
	options: TagOption[],
	borderProps: BorderProps,
}): JSX.Element => {

	return (
		<Box borderColor={borderProps.borderColor}>
			<CreatableSelect<TagOption, true, GroupBase<TagOption>>
				isMulti
				name="tags"
				placeholder={PLACEHOLDERS.TAGS}
				id="tags"
				instanceId="tags"
				closeMenuOnSelect={true}
				options={options}
			/>
		</Box>
	);
};


function BountyFormFields(props: {
  formProps: UseFormReturn<typeof bountyFormFieldValues>;
}): JSX.Element {
	const currencies = useCurrencies();
	const tags = useTags();
	const { colorMode } = useColorMode();
	const {
		register,
		control,
		formState: { errors },
	} = props.formProps;
	const inputBorderColor = 'gray.400';
	const sharedFormatting: FormControlProps = { mt: '5', textColor: colorMode === 'light' ? 'black' : 'white' };
	return (
		<>
			<FormControl isInvalid={!!errors.title} {...sharedFormatting}>
				<FormLabel htmlFor="title">Bounty Title</FormLabel>
				<Input
					id="title"
					borderColor={inputBorderColor}
					placeholder={PLACEHOLDERS.TITLE}
					{...register('title', { required })}
				/>
				<FormErrorMessage>{errors.title?.message}</FormErrorMessage>
			</FormControl>

			<FormControl isInvalid={!!errors.description} {...sharedFormatting}>
				<FormLabel htmlFor="description">Description</FormLabel>
				<Textarea
					id="description"
					borderColor={inputBorderColor}
					placeholder={PLACEHOLDERS.DESCRIPTION}
					{...register('description', { required })}
				/>
				<FormErrorMessage>{errors.description?.message}</FormErrorMessage>
			</FormControl>

			<FormControl isInvalid={!!errors.criteria} {...sharedFormatting}>
				<FormLabel htmlFor="criteria">Criteria</FormLabel>
				<Textarea
					id="criteria"
					borderColor={inputBorderColor}
					placeholder={PLACEHOLDERS.CRITERIA}
					{...register('criteria', { required })}
				/>
				<FormErrorMessage>{errors.criteria?.message}</FormErrorMessage>
			</FormControl>

			<FormControl {...sharedFormatting}>
				<FormLabel htmlFor='tags'>Tags</FormLabel>
				<TagInput
					options={tags.map(function(tag: string) { return { label: tag, value: tag }; })}
					borderProps={{ 'borderColor': inputBorderColor }}
					{...register('tags')}
				/>
			</FormControl>

			<FormControl isInvalid={!!errors.dueAt} {...sharedFormatting}>
				<FormLabel htmlFor="dueAt" mr="0">
					Due At
				</FormLabel>
				<Controller
					name="dueAt"
					control={control}
					rules={{
						required,
						validate: (v) => dateIsNotInPast(v),
					}}
					render={({ field }) => (
						<DatePicker
							selected={new Date(field.value)}
							onChange={(d) => field.onChange(d)}
							id="published-date"
							showPopperArrow={true}
							borderColor={inputBorderColor} />
					)}
				/>
				<FormErrorMessage>{errors.dueAt?.message}</FormErrorMessage>
			</FormControl>

			<Flex>
				<FormControl {...sharedFormatting} isInvalid={!!errors.reward} mr="1">
					<FormLabel htmlFor="reward">Reward</FormLabel>
					<Input
						id="reward"
						borderColor={inputBorderColor}
						{...register('reward', {
							required,
							validate: (v: string) => validNonNegativeDecimal(v),
						})}	/>
					<FormErrorMessage>{errors.reward?.message}</FormErrorMessage>
				</FormControl>

				<FormControl {...sharedFormatting} isInvalid={!!errors.currency}>
					<FormLabel htmlFor="currency">Currency</FormLabel>
					<Select
						id="currency"
						{...register('currency', { required })}
						borderColor={inputBorderColor} >
						{currencies.map((c) => (
							<option key={c}>{c.toUpperCase()}</option>
						))}
					</Select>
					<FormErrorMessage>{errors.currency?.message}</FormErrorMessage>
				</FormControl>
			</Flex>
		</>
	);
}

export default BountyFormFields;
