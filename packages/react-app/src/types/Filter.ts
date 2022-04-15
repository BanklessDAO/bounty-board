import { BountyCollection } from '../models/Bounty';

type StringKeysBountyBoardReward = Extract<keyof BountyCollection['reward'], string>;

export type AcceptedSortInputs = 'reward' | 'createdAt';
export type AcceptedSortOutputs = `reward.${StringKeysBountyBoardReward}` | '_id' | 'createdAt';
export interface FilterParams {
	customerId?: string;
	status?: string
	search: string;
	lte?: number;
	gte?: number;
	sortBy?: string;
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

