import RestrictedTo from '@app/components/global/Auth';
import ErrorAlert from '@app/components/parts/ErrorAlert';
import ACTIVITY from '@app/constants/activity';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import { BountyCollection } from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import { createRewardObject, newActivityHistory } from '@app/utils/formUtils';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import DeleteBountyConfirm from './DeleteBountyConfirm';
import BountyFormFields, { bountyFormFieldValues } from './FormFields';

const getEditData = (
	updatedBountyFormData: typeof bountyFormFieldValues,
	exisitingBounty: BountyCollection,
): Partial<BountyCollection> => {
	/**
   * Transform form data to match shape of bounty collection, then
   * cache to local storage so it can be picked up by the preview page
   */
	return {
		// ...exisitingBounty,
		title: updatedBountyFormData.title,
		description: updatedBountyFormData.description,
		criteria: updatedBountyFormData.criteria,
		dueAt: new Date(updatedBountyFormData.dueAt).toISOString(),
		reward: createRewardObject(
			updatedBountyFormData.reward,
			updatedBountyFormData.currency
		),
		activityHistory: newActivityHistory(exisitingBounty.activityHistory as [], ACTIVITY.EDIT),
	};
};

const editableValues = (bounty: BountyCollection): typeof bountyFormFieldValues => ({
	title: bounty.title,
	description: bounty.description,
	reward: bounty.reward.amount?.toString() as string,
	currency: bounty.reward.currency,
	criteria: bounty.criteria,
	dueAt: bounty.dueAt,
});

const EditBountyForm = ({ bounty }: { bounty: BountyCollection }): JSX.Element => {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const disclosure = useDisclosure();
	const router = useRouter();
	const formProps = useForm({
		defaultValues: editableValues(bounty),
	});
	const { handleSubmit } = formProps;

	useEffect(() => {
		if (bounty.status === BOUNTY_STATUS.DELETED) router.push(`/${bounty._id}`);
	}, [bounty, router]);

	const editBounty = useCallback((editedBounty: Partial<BountyCollection>): void => {
		/**
         * Edit bounty is not guaranteed to have all fields, so we can
         * Instead use the passed bounty details for customerId and _id
         */
		setLoading(true);
		axios.patch<{ data: BountyCollection }>(`api/bounties/${bounty._id}?customerId=${bounty.customerId}`, editedBounty, {
			baseURL: '/',
		})
			.then(({ data: res }) => {
				mutate(`/api/bounties/${bounty._id}`, res.data);
				router.push(`/${bounty._id}`);
				localStorage.removeItem('cachedEdit');
			})
			.catch(err => {
				console.error(err);
				setError('There was a problem editing the bounty');
			})
			.finally(() => setLoading(false))
		;
	}, [bounty, setLoading, router, mutate, axios]);
    
	return (
		<>
			<DeleteBountyConfirm bounty={bounty} disclosure={disclosure} />
			<form onSubmit={handleSubmit(data => {
				const editBountyData = getEditData(data, bounty);
				editBounty(editBountyData);
			})}>
				<BountyFormFields formProps={formProps} />
				<Button
					bg="primary.700"
					my="5"
					w="full"
					type="submit"
					isLoading={loading}
				>
    	Confirm
				</Button>
				<ErrorAlert error={error} setError={setError} />
				<RestrictedTo roles={['delete-own-bounty', 'admin', 'delete-bounties']}>
					<Button
						w='full'
						onClick={disclosure.onOpen}
					>
                    Delete
					</Button>
				</RestrictedTo>
			</form>
		</>
	);
};

export default EditBountyForm;
