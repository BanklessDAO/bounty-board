import { CustomerProps } from '../../../types/Customer';
import { DiscordGuild } from '../../../types/Discord';
import { customers } from '../../../../tests/stubs/customers.stub';
import { guilds } from '../../../../tests/stubs/guilds.stub';

export const BANKLESS: CustomerProps = {
	CustomerName: 'BanklessDAO',
	CustomerId: '834499078434979890',
	Customization: { Logo: './logo.png' },
};

export const getGuilds = async (): Promise<DiscordGuild[] | []> => {
	/**
   * @STUBBED
   * @returns a list of discord guilds for the current user 
   */
	return guilds;
};

export const getCustomer = async (id: string): Promise<CustomerProps | undefined> => {
	/**
	 * @returns a single customer
	 * @param id - the customer id number in the collections db
	 * @STUBBED
	 */
	return customers.find(({ CustomerId }) => CustomerId === id);
};

export const getCustomers = async (): Promise<CustomerProps[] | []> => {
	/**
   * @STUBBED
   * @returns a list of bountyboard customers from the DB 
   */
	const _customers: Promise<CustomerProps[] | []> = Promise.resolve(customers);
	// const _customers = await Customer.find({});
	return _customers;
};

export const filterGuildsToCustomers = (guildsList: DiscordGuild[], customersList: CustomerProps[]): CustomerProps[] | [] => {
	/**
   * @param guilds is the discord guilds
   * @param customers is the customers from the DB
   * @returns only the customers of BB where the user has joined the discord
   */
	const guildIds = guildsList.map(({ id }) => id);
	const filterGuilds = customersList.filter(({ CustomerId }) => guildIds.includes(CustomerId));
	return filterGuilds;
};

export const getCustomersInUsersGuilds = async (): Promise<CustomerProps[]> => {
	/**
   * @returns the list of bankless bounty board customers
   * where the current user is also a discord member.
   */
	console.debug('Called');
	const guildsList = await getGuilds();
	const customersList = await getCustomers();
	const filteredGuilds = filterGuildsToCustomers(guildsList, customersList);
	return filteredGuilds.length === 0 ? [BANKLESS] : filteredGuilds;
};

