import { Controller, UseFormReturn } from 'react-hook-form';
import React from 'react';
import DatePicker from '@app/components/parts/DatePicker';
import {
	Box,
	FormLabel,
	FormControl,
	Input,
	FormErrorMessage,
	Select,
	Flex,
	FormControlProps,
	Textarea,
	BoxProps,
} from '@chakra-ui/react';
import { dateIsNotInPast, required, validNonNegativeDecimal } from '@app/utils/formUtils';

const useCurrencies = (): string[] => {
	return ['BANK'];
};

const PLACEHOLDERS = {
	TITLE: 'Example: Create new Logo',
	DESCRIPTION: 'Example: We need someone to create some snappy looking logos for our new Web3 project.',
	CRITERIA: 'Example: SVG and PNG images approved by the team',
};

export const bountyFormFieldValues = {
	title: '',
	description: '',
	reward: '1000',
	currency: 'BANK',
	criteria: '',
	dueAt: new Date().toISOString(),
};


// Additional text above the main input
const HelperBox = (props: { children?: React.ReactNode, text?: string } & BoxProps): JSX.Element => (
	<Box
		bg="rgba(0,0,0,0.2)"
		p="4"
		my="2"
		textColor="gray.700"
		{...props}
	>{ props.children ? props.children : props.text }
	</Box>
);

function BountyFormFields(props: { formProps: UseFormReturn<typeof bountyFormFieldValues> }) {
	const currencies = useCurrencies();
	const {
		register,
		control,
		formState: {
			errors,
		},
	} = props.formProps;
	const inputBorderColor = 'gray.400';
	const sharedFormatting: FormControlProps = { mt: '5', textColor: 'white' };
	return (
		<>
			<FormControl
				isInvalid={!!errors.title}
				{...sharedFormatting}
			>
				<FormLabel htmlFor='title'>Bounty Title</FormLabel>
				<HelperBox>
					Give the bounty a catchy title
				</HelperBox>
				<Input
					id='title'
					borderColor={inputBorderColor}
					placeholder={PLACEHOLDERS.TITLE}
					{...register('title', { required }) }
				/>
				<FormErrorMessage>{errors.title?.message}</FormErrorMessage>
			</FormControl>

			<FormControl
				isInvalid={!!errors.description}
				{...sharedFormatting}
			>
				<FormLabel htmlFor='description'>Description</FormLabel>
				<HelperBox>
					Provide a brief description of the bounty
				</HelperBox>
				<Textarea
					id='description'
					borderColor={inputBorderColor}
					placeholder={PLACEHOLDERS.DESCRIPTION}
					{...register('description', { required }) }/>
				<FormErrorMessage>{errors.description?.message}</FormErrorMessage>
			</FormControl>

			<FormControl
				isInvalid={!!errors.criteria}
				{...sharedFormatting}
			>
				<FormLabel htmlFor='criteria'>Criteria</FormLabel>
				<HelperBox>
					What is absolutely required before the bounty will be considered complete?
				</HelperBox>
				<Textarea
					id='criteria'
					borderColor={inputBorderColor}
					placeholder={PLACEHOLDERS.CRITERIA}
					{...register('criteria', { required }) }
				/>
				<FormErrorMessage>{errors.criteria?.message}</FormErrorMessage>
			</FormControl>

			<FormControl
				isInvalid={!!errors.dueAt}
				{...sharedFormatting}
			>
				<FormLabel htmlFor="dueAt"
					mr="0"
				>
    Due At
				</FormLabel>
				<Controller
					name="dueAt"
					control={control}
					rules={{
						required,
						validate: v => dateIsNotInPast(v),
					}}
					render={({ field }) =>
						<DatePicker
							selected={new Date(field.value)}
							onChange={d => field.onChange(d)}
							id="published-date"
							showPopperArrow={true}
							borderColor={inputBorderColor}
						/>
					}
				/>
				<FormErrorMessage>{errors.dueAt?.message}</FormErrorMessage>
			</FormControl>

			<Flex>
				<FormControl
					{...sharedFormatting}
					isInvalid={!!errors.reward}
					mr="1"
				>
					<FormLabel htmlFor='reward'>Reward</FormLabel>
					<Input id='reward' borderColor={inputBorderColor} {...register('reward', {
						required, validate: (v: string) => validNonNegativeDecimal(v),
					})} />
					<FormErrorMessage>{errors.reward?.message}</FormErrorMessage>
				</FormControl>

				<FormControl
					{...sharedFormatting}
					isInvalid={!!errors.currency}
				>
					<FormLabel htmlFor='currency'>Currency</FormLabel>
					<Select id='currency' {...register('currency', { required })} borderColor={inputBorderColor}>
						{currencies.map(c => <option key={c}>{c.toUpperCase()}</option>)}
					</Select>
					<FormErrorMessage>{errors.currency?.message}</FormErrorMessage>
				</FormControl>
			</Flex>
		</>
	);
}

export default BountyFormFields;