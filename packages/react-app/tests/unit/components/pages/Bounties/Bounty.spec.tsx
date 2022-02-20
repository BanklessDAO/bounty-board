import * as Claim from '@app/components/pages/Bounties/Bounty/claim';
import { render, screen } from '@testing-library/react';
import React from 'react';

const { ClaimWeb: ClaimPopupLauncher } = Claim;

describe('Testing the bounty claim component', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Disables the claim button if the user is not signed in', () => {
		jest.spyOn(Claim, 'useCanClaim').mockReturnValue(false);
		render(
			<ClaimPopupLauncher onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();

	});

	it('shows the claim button if the user has permissions', () => {
		jest.spyOn(Claim, 'useCanClaim').mockReturnValue(true);
		render(
			<ClaimPopupLauncher onOpen={() => false} />
		);
		const btn = screen.queryByRole('button', { name: 'claim-button' });
		expect(btn).not.toBeNull();
		expect(btn).not.toBeDisabled();
	});
});