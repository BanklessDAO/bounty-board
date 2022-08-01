import AccessibleLink from '@app/components/parts/AccessibleLink';
import { BountyCollection } from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	Button,
	CloseButton,
	Box,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import bountyStatus from '@app/constants/bountyStatus';
import { useState } from 'react';
import activity, { CLIENT } from '@app/constants/activity';

const BountySubmit = ({
	bounty,
}: {
  bounty: BountyCollection;
}): JSX.Element => {
	const router = useRouter();
	const [error, setError] = useState('');
	const upload = () => {
		// update the status of the bounty from DRAFT to OPEN before posting
		bounty.status = bountyStatus.OPEN;
		bounty.statusHistory.push({
			modifiedAt: new Date().toISOString(),
			status: bountyStatus.OPEN,
		});
		bounty.activityHistory.push({
			modifiedAt: new Date().toISOString(),
			activity: activity.PUBLISH,
			client: CLIENT.BOUNTYBOARD,
		});

		// Add the bounty to the DB
		axios
			.post<any, { data: { data: BountyCollection } }>(
				`api/bounties?customerId=${bounty.customerId}`,
				bounty
			)

		// on success, sent the user to the bounty/bountyId page of the newly created bounty
			.then(({ data: res }) => {
				router
					.push(`/${res.data._id}`)

				// once on the 'live' bounty page, remove all the prev bounty data
				// from localstorage
					.then(() => {
						localStorage.removeItem('cachedEdit');
						localStorage.removeItem('previewBounty');
					});
			})
		// if there was a problem, log the error to the console
			.catch((err) => {
				setError('There was a problem submitting the bounty');
				// cannot assume shape of error but we prefer to get the response data
				console.warn(err.response?.data ?? err);
			});
	};
	return (
		<>
			<AccessibleLink href={'/create-bounty'}>
				<Box p={2}>
					<Button>Edit This Draft</Button>
				</Box>
			</AccessibleLink>
			<Box p={2}>
				<Button colorScheme="primary" onClick={() => upload()}>
                   Confirm
				</Button>
			</Box>
			{error && (
				<Alert status="error">
					<AlertIcon />
					<AlertTitle mr={2}>{error}</AlertTitle>
					<CloseButton
						position="absolute"
						right="8px"
						top="8px"
						onClick={() => setError('')}
					/>
				</Alert>
			)}
		</>
	);
};

export default BountySubmit;
