import { CustomerProps } from '../models/Customer';
import { DiscordGuild } from '../types/Discord';
import Customer from '../models/Customer';
import { BANKLESS } from '../constants/Bankless';
import { NextApiQuery } from '@app/types/Queries';

export const getCustomer = async (id: string): Promise<CustomerProps | null> => {
	/**
	 * @returns a single customer
	 * @param id - either the id in the database or the customerId number in the db
	 * It's easy to forget that we need the discord id, so the string id is used as a fallback
	 * @TODO decide if this approach is sensible long term
	 */
	const findWithCustomerId = await Customer.findOne({ customerId: id });
	if (!findWithCustomerId) {
		return Customer.findById(id);
	}
	return findWithCustomerId;
};

type CustomerFilterQuery = {
	customerKey?: string;
};
const getCustomerFilters = (query?: NextApiQuery): CustomerFilterQuery => {
	const customerKey = query?.customerKey;
	if (customerKey && typeof customerKey === 'string') return { customerKey: customerKey.toLowerCase() };
	else return {};
};

export const getCustomers = async (query?: NextApiQuery): Promise<CustomerProps[] | []> => {
	/**
   * @returns a list of bountyboard customers from the DB 
   */
	const filterQuery = query ? getCustomerFilters(query) : {};
	const res = Customer.find(filterQuery).sort({ 'customerName': 1 });
	return res;
};

export const filterGuildsToCustomers = (guildsList: DiscordGuild[], customersList: CustomerProps[]): CustomerProps[] | [] => {
	/**
   * @param guilds is the discord guilds
   * @param customers is the customers from the DB
   * @returns only the customers of BB where the user has joined the discord
   */
	const guildIds = guildsList.map(({ id }) => id);
	const filterGuilds = customersList.filter(({ customerId }) => guildIds.includes(customerId));
	return filterGuilds;
};

export const getCustomersInUsersGuilds = async ({ guilds }: { guilds: DiscordGuild[] | [] }): Promise<CustomerProps[]> => {
	/**
   * @returns the list of bankless bounty board customers
   * where the current user is also a discord member.
   */
	const customersList = await getCustomers();
	const filteredGuilds = filterGuildsToCustomers(guilds, customersList);
	return filteredGuilds.length === 0 ? [BANKLESS] : filteredGuilds;
};

type EditCustomerProps = { customer: CustomerProps, body: Record<string, unknown> };
export const editCustomer = async ({ customer, body }: EditCustomerProps): Promise<CustomerProps> => {
	const updatedCustomer = await Customer.findByIdAndUpdate(customer._id, body, {
		new: true,
		omitUndefined: true,
		runValidators: true,
	}) as CustomerProps;
	return updatedCustomer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
	await Customer.findByIdAndDelete(id);
};

export const createCustomer = async (body: CustomerProps): Promise<CustomerProps> => {
	return await Customer.create(body);
};
