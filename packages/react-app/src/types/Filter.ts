export type AcceptedSortInputs = 'reward';
export type AcceptedSortOuputs = 'reward.amount';

export interface FilterParams {
	status: string;
	search: string;
	$lte?: number;
	$gte?: number;
	sortBy?: string;
	asc: boolean;
}

export interface SortParams {
	sortBy?: AcceptedSortOuputs;
	order: 'asc' | 'desc';
}

