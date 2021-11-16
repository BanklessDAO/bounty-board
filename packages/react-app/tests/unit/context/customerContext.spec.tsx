import { CustomerProps } from '../../../src/models/Customer';
import * as context from '../../../src/context/CustomerContext';

describe('Testing the customer context', () => {
	const setCustomer = jest.fn();
	const customer: CustomerProps = {
		customer_id: '1',
		customerName: 'Test Customer',
	};

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('Retrieves the customer from local storage, if it exists', () => {
		localStorage.setItem('customer', JSON.stringify(customer));
		context.setCustomerFromLocalStorage(setCustomer);
		expect(setCustomer).toHaveBeenCalled();
	});

	it('Does not set the customer if the customer is empty', () => {
		localStorage.removeItem('customer');
		context.setCustomerFromLocalStorage(setCustomer);
		expect(setCustomer).not.toHaveBeenCalled();
	});
  
  
	it('Only sets the customer if the window is defined', () => {
		localStorage.setItem('customer', JSON.stringify(customer));
		jest.spyOn(window, 'window', 'get').mockImplementation(undefined);
		context.setCustomerFromLocalStorage(setCustomer);
		expect(setCustomer).not.toHaveBeenCalled();
	});
});
