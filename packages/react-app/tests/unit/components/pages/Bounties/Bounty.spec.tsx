import { ClaimWeb } from '@app/components/pages/Bounties/Bounty/claim';
import * as useUser from '@app/hooks/useUser';
import * as auth from '@app/components/global/Auth/index';
import * as useExternalRoles from '@app/hooks/useExternalRoles';

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { testBounty } from '../../../../stubs/bounty.stub';
import { BountyCollection } from '@app/models/Bounty';
import Bounties from '@app/components/pages/Bounties';
import { ChakraProvider } from '@chakra-ui/react';
import { BountyMarkPaidButton } from '@app/components/pages/Bounties/Bounty/markPaid';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import PAID_STATUS from '@app/constants/paidStatus';

jest.mock('next/router', () => ({
	useRouter: () => ({ router: { isReady: true } }),
}));

describe('Testing the bounty mark paid/unpaid component', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('No button if the user is not signed in', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(false);
		const claimedBounty = { ...testBounty, status: BOUNTY_STATUS.IN_PROGRESS };
		render(
			<BountyMarkPaidButton bounty={claimedBounty as BountyCollection} onCloseParent={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'mark-paid-button' });
		expect(btn).toBeNull();

	});

	it('shows the button if the user has permissions', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const claimedBounty = { ...testBounty, status: BOUNTY_STATUS.IN_PROGRESS };
		render(
			<BountyMarkPaidButton bounty={claimedBounty as BountyCollection} onCloseParent={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'mark-paid-button' });
		expect(btn).not.toBeNull();
		expect(btn).not.toBeDisabled();
	});

	it('doesn\'t show the button if the bounty isn\'t claimed', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const unclaimedBounty = { ...testBounty, status: BOUNTY_STATUS.OPEN };
		render(
			<BountyMarkPaidButton bounty={unclaimedBounty as BountyCollection} onCloseParent={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'mark-paid-button' });
		expect(btn).toBeNull();
	});

	it('shows Mark Paid if bounty is unpaid', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const claimedBounty = { ...testBounty, status: BOUNTY_STATUS.IN_PROGRESS, paidStatus: PAID_STATUS.UNPAID };
		render(
			<BountyMarkPaidButton bounty={claimedBounty as BountyCollection} onCloseParent={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'mark-paid-button' });
		expect(btn).not.toBeNull();
		expect(btn?.textContent).toEqual('Mark Paid');
	});

	it('shows Mark Unpaid if bounty is paid', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const claimedBounty = { ...testBounty, status: BOUNTY_STATUS.IN_PROGRESS, paidStatus: PAID_STATUS.PAID };
		render(
			<BountyMarkPaidButton bounty={claimedBounty as BountyCollection} onCloseParent={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'mark-paid-button' });
		expect(btn).not.toBeNull();
		expect(btn?.textContent).toEqual('Mark Unpaid');
	});


});

describe('Testing the bounty claim component', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Disables the claim button if the user is not signed in', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(false);
		const baseDom = render(
			<ClaimWeb user={undefined} bounty={testBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/You need to sign in/)
		).toBeInTheDocument();
	});

	it('shows the claim button if the user has permissions', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const { user } = useUser.useUser();
		const baseDom = render(
			<ClaimWeb user={user} bounty={testBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).not.toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/Claim this bounty/)
		).toBeInTheDocument();
	});

	it('disables the claim button for multi-claimant bounties', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const { user } = useUser.useUser();
		const evergreenBounty = { evergreen: true, ...testBounty };
		const baseDom = render(
			<ClaimWeb user={user} bounty={evergreenBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/Cannot claim multi-claimant bounties/)
		).toBeInTheDocument();
	});

	it('disables the claim button for multi-applicant bounties', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const { user } = useUser.useUser();
		const applyBounty = { requireApplication: true, ...testBounty };
		const baseDom = render(
			<ClaimWeb user={user} bounty={applyBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/Cannot claim multi-applicant bounties/)
		).toBeInTheDocument();
	});

	it('enables the claim button for assigned user', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const { user } = useUser.useUser();
		const assignedBounty = { assignTo: { discordId: '12345', discordHandle: 'bob', iconUrl: undefined }, ...testBounty };
		const baseDom = render(
			<ClaimWeb user={user} bounty={assignedBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).not.toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/Claim this bounty/)
		).toBeInTheDocument();
	});

	it('disables the claim button for not assigned user', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		const { user } = useUser.useUser();
		const assignedBounty = { assignTo: { discordId: '12346', discordHandle: 'hal', iconUrl: undefined }, ...testBounty };
		const baseDom = render(
			<ClaimWeb user={user} bounty={assignedBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/assigned to another user/)
		).toBeInTheDocument();
	});

	it('enables the claim button for the gated role', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		jest.spyOn(useExternalRoles, 'useExternalRoles').mockReturnValue(['12345', '67890']);
		const { user } = useUser.useUser();
		const gatedBounty = { gateTo: [{ discordId: '12345', discordName: 'gods', iconUrl: undefined }], ...testBounty };
		const baseDom = render(
			<ClaimWeb user={user} bounty={gatedBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).not.toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/Claim this bounty/)
		).toBeInTheDocument();
	});

	it('disables the claim button for user not in the gated role', async () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		jest.spyOn(useExternalRoles, 'useExternalRoles').mockReturnValue(['12345', '67890']);
		const { user } = useUser.useUser();
		const gatedBounty = { gateTo: [{ discordId: '12346', discordName: 'gods', iconUrl: undefined }], ...testBounty };
		const baseDom = render(
			<ClaimWeb user={user} bounty={gatedBounty as BountyCollection} onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();

		fireEvent.mouseOver(baseDom.getByRole('button', { name: 'claim-button' }));
		expect(
		  await baseDom.findByText(/You do not have a role/)
		).toBeInTheDocument();
	});
});

describe('Testing the bounty listing page', () => {

	afterEach(async () => {
		jest.resetAllMocks();
	});

	it('Shows the Claimed/Created By Me checkboxes if the user is signed in', () => {
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });

		render(
			<ChakraProvider>
				<Bounties />
			</ChakraProvider>
		);
		const chk = screen.queryByText(/claimed by me/i);
		expect(chk).not.toBeNull();
	});

	it('Hides the Claimed/Created By Me checkboxes if the user is not signed in', () => {
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false });
		render(
			<ChakraProvider>
				<Bounties />
			</ChakraProvider>
		);
		const chk = screen.queryByText(/claimed by me/i);
		expect(chk).toBeNull();
	});

});

describe('Submission Notes', () => {

	afterEach(async () => {
		jest.resetAllMocks();
	});

	it('Shows no submission notes if user not logged in', () => {
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false });
		const bounty = testBounty;
		bounty.submissionNotes = 'Some notes';


		render(
			<ChakraProvider>
				<BountyCard bounty={bounty as BountyCollection} />
			</ChakraProvider>

		);
		const chk = screen.queryByText(/Submission Notes/i);
		expect(chk).toBeNull();
	});

	it('Shows submission notes if creator is logged in', () => {
		const bounty = testBounty;
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: bounty.createdBy?.discordId || '12345', username: 'bob', discriminator: '123', avatar: null } });
		bounty.submissionNotes = 'Some notes';

		render(
			<ChakraProvider>
				<BountyCard bounty={bounty as BountyCollection} />
			</ChakraProvider>
		);
		const chk = screen.queryByText(/Submission Notes/i);
		expect(chk).not.toBeNull();
	});

	it('Shows submission notes if claimant is logged in', () => {
		const bounty = testBounty;
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: bounty.claimedBy?.discordId || '12345', username: 'bob', discriminator: '123', avatar: null } });
		bounty.submissionNotes = 'Some notes';

		render(
			<ChakraProvider>
				<BountyCard bounty={bounty as BountyCollection} />
			</ChakraProvider>
		);
		const chk = screen.queryByText(/Submission Notes/i);
		expect(chk).not.toBeNull();
	});

	it('Shows no submission notes if user is not claimant or creator', () => {
		const bounty = testBounty;
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		bounty.submissionNotes = 'Some notes';

		render(
			<ChakraProvider>
				<BountyCard bounty={bounty as BountyCollection} />
			</ChakraProvider>
		);
		const chk = screen.queryByText(/Submission Notes/i);
		expect(chk).toBeNull();
	});

});