import React from 'react';
import axios from 'axios';
import { MenuLinks } from '@app/components/global/Header/MenuLinks';
import { useSession } from 'next-auth/react';
import { BANKLESS } from '../../../../../src/constants/Bankless';
import { guilds as guildsStub } from '@tests/stubs/guilds.stub';
import { render, screen } from '@testing-library/react';

jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
	signOut: jest.fn(),
}));

describe('Testing the menu', () => {
	jest.spyOn(console, 'error')
		.mockImplementation(() => console.log('Supressed Console Error'));

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const useSessionTest = useSession as typeof useSession & any;
	// supress and monitor console warnings
	const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => false);

	it('Renders with a warning about the missing guilds', () => {
		jest.spyOn(axios, 'get').mockImplementation(() => { throw new Error(); });
		useSessionTest.mockImplementation(() => ({ status: '', data: [] }));
		render(<MenuLinks />);
		expect(spyWarn).toHaveBeenCalled();
	});

	it('Shows the selector if signed in and if there are customers', () => {
		jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({ data: guildsStub }));
    
		useSessionTest.mockImplementation(() => ({ status: 'Done', data: {} }));
		jest.spyOn(React, 'useState')
			.mockReturnValueOnce([[BANKLESS], () => console.log('setCustomers')])
			.mockReturnValueOnce([guildsStub, () => console.log('setGuilds')]);
    
		render(<MenuLinks />);
		const input = screen.getByRole('combobox', { name: 'dao-selector' });
		expect(input).toBeVisible();

	});
});