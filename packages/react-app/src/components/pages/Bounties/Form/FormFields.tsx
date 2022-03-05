import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
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

function BountyFormFields(props: { formProps: UseFormReturn<typeof bountyFormFieldValues> }) {
    const currencies = useCurrencies();
    const {
		register,
		control,
		formState: {
			errors,
		},
	} = props.formProps;
	const sharedFormatting: FormControlProps = { mt: '5' };
    return (
    <>
    <FormControl
		isInvalid={!!errors.title}
		{...sharedFormatting}
			>
				<FormLabel htmlFor='title'>Bounty Title</FormLabel>
				<Box
					bg="rgba(0,0,0,0.2)"
					p="4"
					my="2"
				>Give the bounty a catchy title</Box>
				<Input
					id='title'
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
				<Box
					bg="rgba(0,0,0,0.2)"
					p="4"
					my="2"
				>Provide a brief description of the bounty</Box>
				<Textarea
					id='description'
					placeholder={PLACEHOLDERS.DESCRIPTION}
					{...register('description', { required }) }/>
				<FormErrorMessage>{errors.description?.message}</FormErrorMessage>
			</FormControl>

			<FormControl
				isInvalid={!!errors.criteria}
				{...sharedFormatting}
			>
				<FormLabel htmlFor='criteria'>Criteria</FormLabel>
				<Box
					bg="rgba(0,0,0,0.2)"
					p="4"
					my="2"
				>What is absolutely required before the bounty will be considered complete?</Box>
				<Textarea
					id='criteria'
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
                <Input id='reward' {...register('reward', {
                    required, validate: (v: string) => validNonNegativeDecimal(v),
                })} />
                <FormErrorMessage>{errors.reward?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
                {...sharedFormatting}
                isInvalid={!!errors.currency}
            >
                <FormLabel htmlFor='currency'>Currency</FormLabel>
                <Select id='currency' {...register('currency', { required })}>
                    {currencies.map(c => <option key={c}>{c.toUpperCase()}</option>)}
                </Select>
                <FormErrorMessage>{errors.currency?.message}</FormErrorMessage>
            </FormControl>
        </Flex>
    </>
)}

export default BountyFormFields;