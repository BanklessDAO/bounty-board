import Bounty, { BountyCollection } from '../models/Bounty';
import { Query, FilterQuery } from 'mongoose';
import { AcceptedSortOutputs, FilterParams, SortParams } from '../types/Filter';
import { NextApiQuery } from '../types/Queries';
import { BANKLESS } from '../constants/Bankless';
import * as discord from './discord.service';

type BountyQuery = Query<BountyCollection[], BountyCollection>;

export const getFilters = (query: NextApiQuery): FilterParams => {
	/**
	 * Retrieve implemented filters from the query string params
	 */
	const filters = {} as FilterParams;
	
	typeof query.status === 'string' ? filters.status = query.status : null;
	typeof query.search === 'string' ? filters.search = query.search : null;
	typeof query.customer_id === 'string' ? filters.customer_id = query.customer_id : null;
	
	query.lte ? filters.$lte = Number(query.lte) : null;
	query.gte ? filters.$gte = Number(query.gte) : null;

	return filters;
};

export const getSort = (query: NextApiQuery): SortParams => {
	/**
	 * Retrieve implemented sort filters from query string params
	 * Sort defaults to ascending order
	 */
	const sort = {} as SortParams;
	const FALSY_STRINGS = ['false', '0', 'desc', 'no'];
	
	const isDescending = FALSY_STRINGS.includes(query.asc as string);

	isDescending ? sort.order = 'desc' : sort.order = 'asc';
	
	sort.sortBy = getSortByValue(query.sortBy as string);
	
	return sort;
};

export const getSortByValue = (originalInput: string): AcceptedSortOutputs => {
	/**
	 * Allows passing of various values as sort params. These need to coalesce
	 * to a mongoDB schema item, so I've put in a Type for accepted sort outputs
	 * to indicate the required @return value.
	 */
	let output: AcceptedSortOutputs;
	switch (originalInput) {
	// redundant switch written for later extensibility
	case 'reward':
		output = 'reward.amount';
		break;
	default:
		output = 'reward.amount';
	}
	return output;
};

export const filterStatus = (query: FilterQuery<BountyCollection>, status?: string): FilterQuery<BountyCollection> => {
	/**
	 * Pass status and append the corresponding status query to the query object
	 */
	if (status == null || status == '' || status == 'All' || status == undefined) {
		query.status = { $in: ['Open', 'In-Progress', 'In-Review', 'Completed'] };
	} else {
		query.status = status;
	}
	return query;
};

export const filterSearch = (query: FilterQuery<BountyCollection>, search: string): FilterQuery<BountyCollection> => {
	/**
	 * Pass any text search terms to the query object
	 */
	if (!(search == null || search == '')) {
		query['$text'] = { $search: search };
	}
	return query;
};

export const filterLessGreater = ({ by, query, $lte, $gte }: {
	by: AcceptedSortOutputs;
	query: FilterQuery<BountyCollection>;
	$lte?: number;
	$gte?: number;
}): FilterQuery<BountyCollection> => {
	/**
	 * Filters the passed @param by according to a standardised filter query:
	 * Filters are in terms of `by` <= @param $lte 
	 * and/or 
	 * `by` >= @param $gte
	 * Base case is to always filter for (`$gte` >= 0)
	 * @returns a mongoose formatted query
	 */
	const queryBy = { $gte: 0 } as Record<string, number>;
	if ($gte) {
		queryBy.$gte = $gte;
	}
	if ($lte) {
		queryBy.$lte = $lte;
	}
	query[by] = queryBy;
	return query;
};

export const handleEmpty = (query: FilterQuery<BountyCollection>): FilterQuery<BountyCollection> | Record<string, unknown> => {
	const isEmpty: boolean = Object.values(query).every(x => x === null || x === '' || x === undefined);
	return isEmpty ? {} : query;
};

export const filterCustomerId = (query: FilterQuery<BountyCollection>, customer_id?: string): FilterQuery<BountyCollection> => {
	/**
	 * Remove bounties not relating to the currently selected DAO
	 */
	query.customer_id = customer_id ?? BANKLESS.customer_id;
	return query;
};

export const handleFilters = (filters: FilterParams): BountyQuery => {
	/**
	 * Construct the filter query and return query object from mongoose
	 */
	// let filterQuery = {} as FQ<BountyCollection>;
	let filterQuery = {} as FilterQuery<BountyCollection>;
	
	const { status, search, $lte, $gte, customer_id } = filters;
	
	filterQuery = filterStatus(filterQuery, status);
	filterQuery = filterSearch(filterQuery, search);
	filterQuery = filterCustomerId(filterQuery, customer_id);
	filterQuery = filterLessGreater({ query: filterQuery, by: 'reward.amount', $lte, $gte });
	filterQuery = handleEmpty(filterQuery);

	return Bounty.find(filterQuery);
};

export const handleSort = (query: BountyQuery, sort: SortParams): BountyQuery => {
	/**
	 * Take the existing query object and add any sorting information before returning
	 */
	const sortStatement = { [sort.sortBy as string]: sort.order };
	return query.sort(sortStatement);
};

export const getBounties = async (filters: FilterParams, sort: SortParams): Promise<BountyQuery> => {
	/**
	 * @returns the query object (awaiting execution) for getting bounties
	 * having applied the relevant server-side filtering and sorting
	 */
	let query: BountyQuery;
	query = handleFilters(filters);
	query = handleSort(query, sort);
	return query;
};

export const getBounty = async (id: string): Promise<BountyCollection | null> => {
	/**
	 * @param id is a 24 character string, try to find it in the db
	 * If the character !== 24 chars, or we can't find the bounty, return null 
	 */
	return id.length === 24 ? await Bounty.findById(id) : null;
};

export const canBeEdited = ({ bounty, key }: { bounty: BountyCollection, key: string }): boolean => {
	/**
	 * We allow edits to the bounty only if the status is currently `draft` or `open`, and if a valid
	 * edit key is passed.
	 * 
	 * @TODO the edit key is an external dependency from bounty bot, it would be better to wrap a more
	 * complete user-based auth mechanism
	 */
	const validBountyEditKey = bounty.editKey !== key;
	const bountyOpenForEdits = ['draft', 'open'].includes(bounty.status.toLowerCase());
	return validBountyEditKey && bountyOpenForEdits;
};

export const editBounty = async ({ bounty, body }: { bounty: BountyCollection, body: Record<string, unknown> }): Promise<BountyCollection> => {
	const updatedBounty = await Bounty.findByIdAndUpdate(bounty._id, body, {
		new: true,
		omitUndefined: true,
		runValidators: true,
	}) as BountyCollection;
	await discord.publishBountyToDiscordChannel(updatedBounty, updatedBounty.status);
	return updatedBounty;
};

export const deleteBounty = async (id: string): Promise<void> => {
	await Bounty.findByIdAndDelete(id);
};
