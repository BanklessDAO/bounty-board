import { CustomerProps } from '../../../src/models/Customer';
import * as hooks from '@app/hooks/useCustomer';

describe('Testing the customer context', () => {
	const setCustomer = jest.fn();
	const customer: CustomerProps = {
		bountyChannel: '',
		customerKey: '',
		customization: {},
		customerId: '1',
		customerName: 'Test Customer',
	};

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('Retrieves the customer from local storage, if it exists', () => {
		localStorage.setItem('customer', JSON.stringify(customer));
		hooks.setCustomerFromLocalStorage(setCustomer);
		expect(setCustomer).toHaveBeenCalled();
	});

	it('Does not set the customer if the customer is empty', () => {
		localStorage.removeItem('customer');
		hooks.setCustomerFromLocalStorage(setCustomer);
		expect(setCustomer).not.toHaveBeenCalled();
	});


	it('Only sets the customer if the window is defined', () => {
		localStorage.setItem('customer', JSON.stringify(customer));
		jest.spyOn(window, 'window', 'get').mockImplementation(undefined);
		hooks.setCustomerFromLocalStorage(setCustomer);
		expect(setCustomer).not.toHaveBeenCalled();
	});
});
