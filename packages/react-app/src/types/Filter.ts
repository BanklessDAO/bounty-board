import { BountyBoardProps } from '../models/Bounty';

type StringKeysBountyBoardReward = Extract<keyof BountyBoardProps['reward'], string>;

export type AcceptedSortInputs = 'reward';
export type AcceptedSortOutputs = `reward.${StringKeysBountyBoardReward}`;

export interface FilterParams {
	customerId?: string;
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

