import { BountyCollection } from '../models/Bounty';

type StringKeysBountyBoardReward = Extract<keyof BountyCollection['reward'], string>;

export type AcceptedSortInputs = 'reward';
export type AcceptedSortOutputs = `reward.${StringKeysBountyBoardReward}`;

export interface FilterParams {
	customer_id?: string;
	status?: string;
	search: string;
	$lte?: number;
	$gte?: number;
	sortBy?: string;
	asc: boolean;
}

export interface SortParams {
	sortBy?: AcceptedSortOutputs;
	order: 'asc' | 'desc';
}

