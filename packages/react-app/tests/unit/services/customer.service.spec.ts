import * as service from '../../../src/services/customer.service';
import { customers } from '../../stubs/customers.stub';
import { guilds } from '../../stubs/guilds.stub';

describe('Testing the customer service', () => {

	it('Returns a list of customers where the user is in the guild', async () => {
		jest.spyOn(service, 'getCustomers')
			.mockReturnValue(Promise.resolve(customers));

		const filteredCustomers = await service.getCustomersInUsersGuilds(guilds);
		expect(filteredCustomers.length).toEqual(customers.length - 1);
	});

	it('Returns bankless if no guilds are found', async () => {
		jest.spyOn(service, 'getCustomers')
			.mockReturnValue(Promise.resolve(customers));

		const filteredCustomers = await service.getCustomersInUsersGuilds([]);
		expect(filteredCustomers[0].CustomerName).toEqual('BanklessDAO');
	});
});
