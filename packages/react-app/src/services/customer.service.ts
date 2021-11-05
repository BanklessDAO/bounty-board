import { CustomerProps } from '../models/Customer';
import { DiscordGuild } from '../types/Discord';
import Customer from '../models/Customer';
import { BANKLESS } from '../constants/Bankless';

export const getCustomer = async (id: string): Promise<CustomerProps | null> => {
	/**
	 * @returns a single customer
	 * @param id - the customer id number in the collections db
	 */
	return Customer.findById(id);
};

export const getCustomers = async (): Promise<CustomerProps[] | []> => {
	/**
   * @returns a list of bountyboard customers from the DB 
   */
	return Customer.find({}).sort({ 'CustomerName': 1 });
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

export const getCustomersInUsersGuilds = async (guildsList: DiscordGuild[] | []): Promise<CustomerProps[]> => {
	/**
   * @returns the list of bankless bounty board customers
   * where the current user is also a discord member.
   */
	const customersList = await getCustomers();
	const filteredGuilds = filterGuildsToCustomers(guildsList, customersList);
	return filteredGuilds.length === 0 ? [BANKLESS] : filteredGuilds;
};

