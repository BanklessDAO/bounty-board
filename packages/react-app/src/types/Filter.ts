import { BountyCollection } from '../models/Bounty';

type StringKeysBountyBoardReward = Extract<keyof BountyCollection['reward'], string>;

export type AcceptedSortInputs = 'reward' | 'createdAt' | 'status' | 'paidStatus';
export type AcceptedSortOutputs = `reward.${StringKeysBountyBoardReward}` | '_id' | 'createdAt' | 'paidStatusIdx' | 'statusIdx';
export interface FilterParams {
	customerId?: string;
	status?: string;
	paidStatus?: string;
	search: string;
	lte?: number;
	gte?: number;
	sortBy?: string;
	createdBy?: string;
	claimedBy?: string;
	customerKey?: string;
	asc: boolean | string;
	next?: string;
	previous?: string;
	limit?: number;
}

export type UseFilterState = {
	filters: FilterParams,
	setFilters: (f: FilterParams) => void;
}
export interface SortParams {
	sortBy?: AcceptedSortOutputs;
	order: boolean;
}

