import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import {
	FormErrorMessage,
	FormLabel,
	FormControl,
	Input,
	Button,
	Textarea,
} from '@chakra-ui/react';

const Form = ({ bountyForm }: { bountyForm: any }): JSX.Element => {
	const router = useRouter();
	const contentType = 'application/json';

	const schema = yup.object().shape({
		title: yup
			.string()
			.required('Please provide a title for this Bounty.')
			.max(250, 'Title cannot be more than 250 characters'),
		description: yup
			.string()
			.required('Please provide the bounty description')
			.max(4000, 'Description cannot be more than 4000 characters'),
		criteria: yup
			.string()
			.required('Please provide the bounty criteria')
			.max(4000, 'Criteria cannot be more than 4000 characters'),
		rewardAmount: yup
			.number()
			.typeError('Invalid number')
			.positive()
			.required('Please provide the bounty reward amount'),
	});

	/* This fixes the displayed value for rewardAmount to use the correct scale */
	const defaults = {
		...bountyForm,
		rewardAmount: bountyForm.reward.amount,
	};
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: defaults,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		reset(defaults);
	}, [reset]);

	const patchData = async (values: any) => {
		/* Sanitize output data and change status to open */
		/* Convert input amount's decimal place into scale */
		const amount = values.rewardAmount.toString().replace(/\./g, '');
		const scale = values.rewardAmount.toString().split('.')[1]?.length || 0;
		/* Add an entry to statusHistory */
		const setAt = new Date(Date.now()).toISOString();
		const statusHistory = values.statusHistory.concat({
			status: 'Open',
			setAt: setAt,
		});
		const output = {
			...values,
			rewardAmount: undefined,
			rewardCurrency: undefined,
			reward: { amount: Number(amount), currency: 'BANK', scale: scale },
			status: 'Open',
			statusHistory: statusHistory,
		};

		const { id } = router.query;
		try {
			const res = await fetch(`/api/bounties/${id}`, {
				method: 'PATCH',
				headers: {
					Accept: contentType,
					'Content-Type': contentType,
				},
				body: JSON.stringify(output),
			});

			if (!res.ok) {
				if (res.status === 400) {
					router.push('/400');
				}
				throw new Error(`${res.status}`);
			}

			const { data } = await res.json();
			mutate(`/api/bounties/${id}`, data, false);
			router.push('/');
		} catch (error) {
			console.error(error);
		}
	};
	function onSubmit(values: JSON) {
		return new Promise<void>((resolve) => {
			patchData(values).catch(console.error);
			resolve();
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit as SubmitHandler<JSON>)}>
			<FormControl isInvalid={Boolean(errors.title)} mb={5}>
				<FormLabel htmlFor="title">Title</FormLabel>
				<Input id="title" placeholder="title" {...register('title')} />
				<FormErrorMessage>{errors.title?.message}</FormErrorMessage>
			</FormControl>
			<FormControl isInvalid={Boolean(errors.description)} mb={5}>
				<FormLabel htmlFor="description">Description</FormLabel>
				<Textarea
					id="description"
					placeholder="description"
					{...register('description')}
				/>
				<FormErrorMessage>{errors.description?.message}</FormErrorMessage>
			</FormControl>
			<FormControl isInvalid={Boolean(errors.criteria)} mb={5}>
				<FormLabel htmlFor="criteria">Criteria</FormLabel>
				<Textarea
					id="criteria"
					placeholder="criteria"
					{...register('criteria')} />
				<FormErrorMessage>{errors.criteria?.message}</FormErrorMessage>
			</FormControl>
			<FormControl isInvalid={Boolean(errors.rewardAmount)} mb={5}>
				<FormLabel htmlFor="rewardAmount">Reward ($BANK)</FormLabel>
				<Input
					id="rewardAmount"
					placeholder="amount"
					{...register('rewardAmount')} />
				<FormErrorMessage>{errors.rewardAmount?.message}</FormErrorMessage>
			</FormControl>

			<Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
               Submit
			</Button>
		</form>
	);
};

export default Form;
