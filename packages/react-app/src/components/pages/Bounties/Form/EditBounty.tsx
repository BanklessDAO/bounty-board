import RestrictedTo from '@app/components/global/Auth';
import ACTIVITY from '@app/constants/activity';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import { BountyCollection } from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import { createRewardObject, newActivityHistory, newStatusHistory } from '@app/utils/formUtils';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
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
		activityHistory: newActivityHistory(exisitingBounty.activityHistory as [], ACTIVITY.EDIT)
	};
};

const editableValues = (bounty: BountyCollection): typeof bountyFormFieldValues => ({
    title: bounty.title,
	description: bounty.description,
	reward: bounty.reward.amount?.toString() as string,
	currency: bounty.reward.currency,
	criteria: bounty.criteria,
	dueAt: bounty.dueAt,
})


const EditBountyForm = ({ bounty }: { bounty: BountyCollection }): JSX.Element => {
    const [error, setError] = useState('');

	const router = useRouter();
	const formProps = useForm({
        defaultValues: editableValues(bounty)
    });
    const { handleSubmit } = formProps;

    console.debug({ bounty })

    const edit = (editedBounty: Partial<BountyCollection>) => {
        /**
         * Edit bounty is not guaranteed to have all fields, so we can
         * Instead use the passed bounty details for customerId and _id
         */
		axios.patch<any, { data: { data: BountyCollection } }>(`api/bounties/${bounty._id}?customerId=${bounty.customerId}`, editedBounty, {
            baseURL: '/'
        })
			.then(({ data: res }) => {
                mutate(`/api/bounties/${bounty._id}`, res.data);
				router.push(`/${bounty._id}`)
                localStorage.removeItem('cachedEdit');
			})
			.catch(err => {
				const errorData = err.response?.data;
				setError('There was a problem Editing the bounty');
				errorData ? console.debug({ errorData }) : console.debug({ err });
			}
		);
	};

    const moveBountyToDeleted = (bounty: BountyCollection): void => {
        if (!confirm('Are you sure you want to delete this bounty?')) return;
        const deleteData: Partial<BountyCollection> = {
            activityHistory: newActivityHistory(bounty.activityHistory as [], ACTIVITY.DELETE),
            statusHistory: newStatusHistory(bounty.statusHistory as [], BOUNTY_STATUS.DELETED),
            status: BOUNTY_STATUS.DELETED
        };
        edit(deleteData);
    };
    
    
	return (
		<form onSubmit={handleSubmit(data => {
			const editBounty = getEditData(data, bounty);
            edit(editBounty);
		})}>
			<BountyFormFields formProps={formProps} />
			<Button
				my="5"
				w="full"
				type="submit"
			>
    	Confirm
			</Button>
            <RestrictedTo roles={['delete-own-bounty', 'admin', 'delete-bounties']}>
                <Button 
                    w='full'
                    bg={'red.700'}
                    onClick={() => moveBountyToDeleted(bounty)}
                >
                    DELETE
                </Button>
            </RestrictedTo>
		</form>
	);
};

export default EditBountyForm;
