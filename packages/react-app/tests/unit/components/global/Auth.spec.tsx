import RestrictedTo from '@app/components/global/Auth';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Testing the resticted component', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Renders a component if the user has correct permissions', () => {
		jest.spyOn(React, 'useContext').mockImplementation(() => ({
			roles: ['create-bounty'],
		}));
		render(
			<RestrictedTo roles={['create-bounty']}>
				<button aria-label="test-button">Should Render</button>
			</RestrictedTo>
		);
		const btn = screen.queryByRole('button', { name: 'test-button' });
		expect(btn).not.toBeNull();
	});

	it('Does not render a component if the user does not have correct permissions', () => {
		jest.spyOn(React, 'useContext').mockImplementation(() => ({
			roles: ['create-bounty'],
		}));
		render(
			<RestrictedTo roles={['edit-bounty']}>
				<button aria-label="test-button2">Should Not Render</button>
			</RestrictedTo>
		);
		const btn = screen.queryByRole('button', { name: 'test-button2' });
		expect(btn).toBeNull();
	});
});

