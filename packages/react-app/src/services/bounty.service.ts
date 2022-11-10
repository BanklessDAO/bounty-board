import { NextApiRequest } from 'next';
import { FilterQuery, PaginateResult } from 'mongoose';
import Bounty from '../models/BountyDb';
import { BountyCollection } from '../models/Bounty';
import { AcceptedSortOutputs, FilterParams, SortParams } from '../types/Filter';
import { NextApiQuery } from '../types/Queries';
import * as discord from './discord.service';
import PAID_STATUS from '@app/constants/paidStatus';

export type BountyQuery = FilterQuery<BountyCollection> & {
  next?: string;
  prev?: string;
};
export type AddFieldsQuery = { $addFields: { [key: string]: any } };

export const getFilters = (query: NextApiQuery): FilterParams => {
	/**
   * Retrieve implemented filters from the query string params
   */
	const filters = {} as FilterParams;

	if (typeof query.status === 'string') {filters.status = query.status ? query.status.split(',') : [];}
	if (typeof query.paidStatus === 'string') {filters.paidStatus = query.paidStatus ? query.paidStatus.split(',') : [];}
	if (typeof query.search === 'string') filters.search = query.search;
	if (typeof query.customerId === 'string') {filters.customerId = query.customerId;}
	if (typeof query.createdBy === 'string') filters.createdBy = query.createdBy;
	if (typeof query.claimedBy === 'string') filters.claimedBy = query.claimedBy;
	if (typeof query.tags === 'string') filters.tags = query.tags ? query.tags.split(',') : [];

	if (query.lte) filters.lte = Number(query.lte);
	if (query.gte) filters.gte = Number(query.gte);
	return filters;
};

export const getAdditionalFields = (): AddFieldsQuery => {
	/**
   * Add additional fields to sort by paidStatus
   */
	const paidOrder = ['Unpaid', 'Paid'];
	const paidQuery = {
		paidStatusIdx: { $indexOfArray: [paidOrder, '$paidStatus'] },
	};

	/**
   * Add additional fields to sort by bounty status
   */
	const statusOrder = [
		'Draft',
		'Open',
		'In-Progress',
		'In-Review',
		'Completed',
		'Rejected',
		'Deleted',
	];
	const statusQuery = {
		statusIdx: { $indexOfArray: [statusOrder, '$status'] },
	};

	return { $addFields: { ...paidQuery, ...statusQuery } };
};

export const getSort = (query: NextApiQuery): BountyQuery =>
/**
   * Retrieve implemented sort filters from query string params
   * Sort defaults to ascending order
   */
	({
		$sort: {
			[getSortByValue(query.sortBy as string)]: [
				'false',
				'0',
				'desc',
				'no',
			].includes(query.asc as string)
				? -1
				: 1,
		},
	});

export const getSortByValue = (originalInput: string): AcceptedSortOutputs => {
	/**
   * Allows passing of various values as sort params. These need to coalesce
   * to a mongoDB schema item, so there is a Type for accepted sort outputs
   * to indicate the required @return value.
   */
	let output: AcceptedSortOutputs;
	switch (originalInput) {
	// redundant switch written for later extensibility
	case 'reward':
		output = 'reward.amount';
		break;
	case 'createdAt':
		output = 'createdAt';
		break;
	case 'paidStatus':
		output = 'paidStatusIdx';
		break;
	case 'status':
		output = 'statusIdx';
		break;
	default:
		output = 'createdAt';
	}
	return output;
};

export const filterStatus = (
	query: FilterQuery<BountyCollection>,
	status?: string[]
): FilterQuery<BountyCollection> => {
	/**
   * Pass status and append the corresponding status query to the query object
   */

	query.status = {
		$in:
      status && status.length
      	? status
      	: ['Open', 'In-Progress', 'In-Review', 'Completed'],
	};
	return query;
};

export const filterPaidStatus = (
	query: FilterQuery<BountyCollection>,
	paidStatus?: string[]
): FilterQuery<BountyCollection> => {
	/**
   * Pass paid status and append the corresponding status query to the query object
   */
	query.$or = [
		{
			paidStatus: {
				$in:
          paidStatus && paidStatus.length
          	? paidStatus
          	: [PAID_STATUS.PAID, PAID_STATUS.UNPAID],
			},
		},
	];

	if (
		!(paidStatus && paidStatus.length) ||
    paidStatus.includes(PAID_STATUS.UNPAID)
	) {
		query.$or.push({ paidStatus: { $exists: false } });
	}
	return query;
};

export const filterSearch = (
	query: FilterQuery<BountyCollection>,
	search: string
): FilterQuery<BountyCollection> => {
	/**
   * Pass any text search terms to the query object
   */
	if (!(search == null || search == '')) {
		query['$text'] = { $search: search };
	}
	return query;
};

export const filterLessGreater = ({
	by,
	query,
	lte,
	gte,
}: {
  by: AcceptedSortOutputs;
  query: FilterQuery<BountyCollection>;
  lte?: number;
  gte?: number;
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
	if (gte) {
		queryBy.$gte = gte;
	}
	if (lte) {
		queryBy.$lte = lte;
	}
	query[by] = queryBy;
	return query;
};

export const handleEmpty = (
	query: FilterQuery<BountyCollection>
): FilterQuery<BountyCollection> | Record<string, unknown> => {
	const isEmpty: boolean = Object.values(query).every(
		(x) => x === null || x === '' || x === undefined
	);
	return isEmpty ? {} : query;
};

export const filterCustomerId = (
	query: FilterQuery<BountyCollection>,
	customerId: string
): FilterQuery<BountyCollection> => {
	/**
   * Remove bounties not relating to the currently selected DAO
   */
	query.customerId = customerId;
	return query;
};

export const filterByUser = (
	query: FilterQuery<BountyCollection>,
	claimedBy: string | undefined,
	createdBy: string | undefined
): FilterQuery<BountyCollection> => {
	/**
   * Remove bounties based on user
   */
	if (typeof claimedBy !== undefined && claimedBy) {
		query['claimedBy.discordId'] = claimedBy;
	}
	if (typeof createdBy !== undefined && createdBy) {
		query['createdBy.discordId'] = createdBy;
	}

	return query;
};

export const getPagination = (query: NextApiQuery): BountyQuery => ({
	/**
   * Extracts pagination variables from the request into a bountyQuery
   * @param query is the next query object
   * @returns a valid bountyQuery
   */
	next: query.next && typeof query.next === 'string' ? query.next : undefined,
	previous:
    query.previous && typeof query.previous === 'string'
    	? query.previous
    	: undefined,
	limit: Number(query.limit) ? Number(query.limit) : 1000,
});

export const filterTags = (query: FilterQuery<BountyCollection>, tags?: string[]): FilterQuery<BountyCollection> => {
	if (tags && tags.length) {
		query.$and = [
			{
				$or:
				[
					{ 'tags.channelCategory': { $in: tags } },
					{ 'tags.keywords': { $in: tags } },
				],
			},
		];
	}
	return query;
};

export const getFilterQuery = (query: NextApiQuery): BountyQuery => {
	/**
   * Construct the filter query and return query object from mongoose
   */
	let filterQuery = {} as FilterQuery<BountyCollection>;

	const filters = getFilters(query);

	const {
		status,
		paidStatus,
		search,
		lte,
		gte,
		customerId,
		claimedBy,
		createdBy,
		tags,
	} = filters;

	filterQuery = filterStatus(filterQuery, status);
	filterQuery = filterPaidStatus(filterQuery, paidStatus);
	filterQuery = filterSearch(filterQuery, search);
	if (customerId) filterQuery = filterCustomerId(filterQuery, customerId);
	filterQuery = filterLessGreater({
		query: filterQuery,
		by: 'reward.amount',
		lte,
		gte,
	});
	filterQuery = filterByUser(filterQuery, claimedBy, createdBy);
	filterQuery = filterTags(filterQuery, tags);
	filterQuery = handleEmpty(filterQuery);

	return { $match: filterQuery };
};

export const handleSort = (sort: SortParams): BountyQuery => {
	/**
   * Take the existing query object and add any sorting information before returning
   */
	return {
		paginatedField: sort.sortBy,
		sortAscending: sort.order,
	};
};

export const getBounties = async (
	req: NextApiRequest
): Promise<PaginateResult<BountyCollection> | PaginateResult<[]>> => {
	/**
   * Grabs the filter, sort and pagination options from the request into a BountyQuery
   * Object that can be passed to the Bounty.paginate function.
   * @returns a list of bounties
   */
	const addFieldsQuery = getAdditionalFields();
	const filterQuery = getFilterQuery(req.query);
	const sortQuery = getSort(req.query);
	const paginationOptions = getPagination(req.query);

	const bountyQuery: BountyQuery = {
		aggregation: [filterQuery, addFieldsQuery, sortQuery],
		...paginationOptions,
	};

	const aggregation = await Bounty.aggregateFn(bountyQuery);

	// Populate the payee data from the User DB. Needed until wallet addresses are stored directly in bounties
	// Had to use a for loop so we didn't end up with a bunch of parallel db connections
	if (aggregation && aggregation.results) {
		const populatedResults = [];
		for (const bounty of (aggregation.results as Array<BountyCollection>)) {
			populatedResults.push(await Bounty.populate(bounty, [{ path: 'payeeData' }]));
		}
		aggregation.results = populatedResults;
	}

	return aggregation;
};

export const getBounty = async (
	id: string
): Promise<BountyCollection | null> => {
	/**
   * @param id is a 24 character string, try to find it in the db
   * If the character !== 24 chars, or we can't find the bounty, return null
   */
	return id.length === 24 ? await Bounty.findById(id).populate('payeeData') : null;
};

type EditBountyProps = {
  bounty: BountyCollection;
  body: Record<string, unknown>;
};
export const editBounty = async ({
	bounty,
	body,
}: EditBountyProps): Promise<BountyCollection> => {
	const updatedBounty = (await Bounty.findByIdAndUpdate(bounty._id, body, {
		new: true,
		omitUndefined: true,
		runValidators: true,
	})) as BountyCollection;
	await discord.publishBountyToDiscordChannel(
		updatedBounty,
		updatedBounty.status
	);
	return updatedBounty;
};

export const deleteBounty = async (id: string): Promise<void> => {
	await Bounty.findByIdAndDelete(id);
};

export const createBounty = async (
	body: BountyCollection
): Promise<BountyCollection> => {
	return await Bounty.create(body);
};
