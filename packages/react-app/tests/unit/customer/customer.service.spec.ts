import Customer from '../../../src/models/Customer';
import * as service from '../../../src/pages/api/customer/customer.service';
import { customers } from '../../stubs/customers.stub';
import { guilds } from '../../stubs/guilds.stub';

describe('Testing multitenacy for the end user', () => {

	it('Gets a list of bankless customers from the db', async () => {
		// this will fail until we create the customer collection
		// @dev: should this be an integration test
		const dbCustomers = await Customer.find();
		const serviceCustomers = await service.getCustomers();
		expect(dbCustomers).toEqual(serviceCustomers);
	});

	it('Returns a list of customers where the user is in the guild', async () => {
		jest.spyOn(service, 'getCustomers')
			.mockReturnValue(Promise.resolve(customers));

		jest.spyOn(service, 'getGuilds')
			.mockReturnValue(Promise.resolve(guilds));

		const filteredCustomers = await service.getCustomersInUsersGuilds();
		expect(filteredCustomers.length).toEqual(customers.length - 1);
	});

	it('Returns bankless if no guilds are found', async () => {
		jest.spyOn(service, 'getCustomers')
			.mockReturnValue(Promise.resolve(customers));

		jest.spyOn(service, 'getGuilds')
			.mockReturnValue(Promise.resolve([]));

		const filteredCustomers = await service.getCustomersInUsersGuilds();
		expect(filteredCustomers[0].CustomerName).toEqual('BanklessDAO');
	});
});
