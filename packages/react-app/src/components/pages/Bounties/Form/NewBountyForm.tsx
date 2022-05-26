import { useForm } from 'react-hook-form';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import {
	Text,
	Button,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import { BountyCollection } from '@app/models/Bounty';
import bountyStatus from '@app/constants/bountyStatus';
import { CustomerContext } from '@app/context/CustomerContext';
import { APIUser } from 'discord-api-types';
import { useUser } from '@app/hooks/useUser';
import { useLocalStorage } from '@app/hooks/useLocalStorage';
import { WARNINGS } from '@app/errors';
import activity, { CLIENT } from '@app/constants/activity';
import BountyFormFields, { bountyFormFieldValues } from './FormFields';
import { createRewardObject } from '@app/utils/formUtils';


const NotNeededFields = [
	'_id',
	'claimedBy',
	'submissionNotes',
	'submissionUrl',
	'season',
	'claimedAt',
	'submittedAt',
	'reviewedAt',
	'reviewedBy',
	'submittedBy',
	'paidStatus',
	'evergreen',
	'claimLimit',
	'isParent',
	'parentId',
	'childrenIds',
	'assign',
	'assignedName',
	'gate',
	'requireApplication',
	'applicants',
	'isIOU',
	'resolutionNote',
	'owedTo',
	'canonicalCard',
	'creatorMessage',
	'claimantMessage',
	'createdInChannel',
] as const;

const useCachedForm = () => {
	const { data: cachedBounty } = useLocalStorage<typeof bountyFormFieldValues>('cachedEdit');
	return cachedBounty ?? bountyFormFieldValues;
};

const generatePreviewData = (
	data: typeof bountyFormFieldValues,
	customerId: string,
	user: APIUser
): Omit<BountyCollection, typeof NotNeededFields[number]> => {
	/**
   * Transform form data to match shape of bounty collection, then
   * cache to local storage so it can be picked up by the preview page
   */
	return {
		title: data.title,
		description: data.description,
		criteria: data.criteria,
		customerId,
		status: bountyStatus.DRAFT,
		dueAt: new Date(data.dueAt).toISOString(),
		reward: createRewardObject(data.reward, data.currency),
		statusHistory: [
			{
				status: bountyStatus.DRAFT,
				modifiedAt: new Date().toISOString(),
			},
		],
		activityHistory: [
			{
				activity: activity.CREATE,
				modifiedAt: new Date().toISOString(),
				client: CLIENT.BOUNTYBOARD,
			},
		],
		discordMessageId: '',
		createdAt: new Date().toISOString(),
		createdBy: {
			discordHandle: `${user.username}#${user.discriminator}`,
			discordId: user.id,
			iconUrl: '',
		},
	};
};

const NewBountyForm = (): JSX.Element => {
	const router = useRouter();
	const { user, error } = useUser();
	const cachedBounty = useCachedForm();
	const { customer: { customerId } } = useContext(CustomerContext);
	const formProps = useForm({
		defaultValues: cachedBounty,
	});

	if (error) {
		console.warn('Could not fetch the user data from discord - this will cause issues trying to create bounties');
	}
	return (
		<form onSubmit={formProps.handleSubmit(data => {
			const preview = user && generatePreviewData(data, customerId, user);
			localStorage.setItem('cachedEdit', JSON.stringify(data));
			localStorage.setItem('previewBounty', JSON.stringify(preview));
			router.push('/preview-bounty');
		})}>
			<BountyFormFields formProps={formProps} />
			<Button
				my="5"
				w="full"
				type="submit"
				disabled={!user}
			>
				Preview
			</Button>
			{
				!user && <Alert status='warning'>
					<AlertIcon />
					<Text maxW="500px">{WARNINGS.ADBLOCKER}</Text>
				</Alert>
			}
		</form>
	);
};

export default NewBountyForm;
