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
			.mockReturnValue(new Promise(res => res(customers)));

		jest.spyOn(service, 'getGuilds')
			.mockReturnValue(new Promise(res => res(guilds)));

		const filteredCustomers = await service.getCustomersInUsersGuilds();
		expect(filteredCustomers).toEqual([customers[0]]);
	});

	it('Returns bankless if no guilds are found', async () => {
		jest.spyOn(service, 'getCustomers')
			.mockReturnValue(new Promise(res => res(customers)));

		jest.spyOn(service, 'getGuilds')
			.mockReturnValue(new Promise(res => res([])));

		const filteredCustomers = await service.getCustomersInUsersGuilds();
		expect(filteredCustomers).toEqual([{
			name: 'BanklessDAO',
			customerId: '1',
		}]);
	});
});
