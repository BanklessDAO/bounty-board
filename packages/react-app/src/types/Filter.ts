export type AcceptedSorts = 'reward.amount';

export interface FilterParams {
	status: string;
	search: string;
	$lte?: number;
	$gte?: number;
	sortBy?: string;
	asc: boolean;
}

export interface SortParams {
	sortBy?: string;
	ascending: 'asc' | 'desc';
}

