import { ClaimWeb } from '@app/components/pages/Bounties/Bounty/claim';
import Bounties from '@app/components/pages/Bounties/index';
import * as useUser from '@app/hooks/useUser';
import * as auth from '@app/components/global/Auth/index';
import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('next/router', () => ({
	useRouter: () => ({ router: { isReady: true } }),
}));

describe('Testing the bounty claim component', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Disables the claim button if the user is not signed in', () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(false);
		render(
			<ClaimWeb onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();

	});

	it('shows the claim button if the user has permissions', () => {
		jest.spyOn(auth, 'useRequiredRoles').mockReturnValue(true);
		render(
			<ClaimWeb onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).not.toBeDisabled();
	});

	it('Shows the Claimed/Created By Me checkboxes if the user is signed in', () => {
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false, user: { id: '12345', username: 'bob', discriminator: '123', avatar: null } });
		render(
			<Bounties />
		);
		const chk = screen.queryByText(/claimed by me/i);
		expect(chk).not.toBeNull();
	});

	it('Hides the Claimed/Created By Me checkboxes if the user is not signed in', () => {
		jest.spyOn(useUser, 'useUser').mockReturnValue({ loading: false });
		render(
			<Bounties />
		);
		const chk = screen.queryByText(/claimed by me/i);
		expect(chk).toBeNull();
	});

});