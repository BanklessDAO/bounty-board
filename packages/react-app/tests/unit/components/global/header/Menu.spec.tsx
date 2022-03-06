import React from 'react';
import axios from 'axios';
import { MenuLinks } from '@app/components/global/Header/MenuLinks';
import { useSession } from 'next-auth/react';
import { act, render, screen, waitFor } from '@testing-library/react';

jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
	signOut: jest.fn(),
}));

describe('Testing the menu', () => {
	let spyWarn: jest.SpyInstance;
	beforeEach(() => {
		jest.spyOn(axios, 'post').mockResolvedValue({ data: { data: [] } });
		spyWarn = jest.spyOn(console, 'warn');
	});

	afterEach(() => jest.resetAllMocks());

	const useSessionTest = useSession as typeof useSession & any;
	
	it('Shows the selector if signed in and if there are customers', async () => {
		useSessionTest.mockImplementation(() => ({ status: 'Done', data: {} }));
		
		// async state updates require wrapping component in act then using waitFor to listen for promise resolution
		act(() => {
			render(<MenuLinks />);
		});
		
		const input = screen.getByRole('combobox', { name: 'dao-selector' });
		await waitFor(() => expect(input).toBeVisible());

	});

	it('Token fetcher signs the user out on 401', async () => {
		jest.spyOn(axios, 'get').mockRejectedValue({ response: { status: 401 } });
		useSessionTest.mockImplementation(() => ({ status: 'Done', data: {} }));
		
		act(() => {
			render(<MenuLinks />);
		});
		
		await waitFor(() => expect(spyWarn).toHaveBeenNthCalledWith(1, '401 Problem fetching guilds in discord api - signing out'));
	});

	it('Token fetcher does not sign the user out on 400 or other errors', async () => {
		jest.spyOn(axios, 'get').mockRejectedValue({ response: { status: 400 } });
		useSessionTest.mockImplementation(() => ({ status: 'Done', data: {} }));
		
		act(() => {
			render(<MenuLinks />);
		});
		
		await waitFor(() => expect(spyWarn).not.toHaveBeenNthCalledWith(1, '401 Problem fetching guilds in discord api - signing out'));
	});
});