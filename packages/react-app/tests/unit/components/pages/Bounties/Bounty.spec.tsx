import { ClaimWeb } from '@app/components/pages/Bounties/Bounty/claim';
import * as auth from '@app/components/global/Auth/index';
import { render, screen } from '@testing-library/react';
import React from 'react';


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
});