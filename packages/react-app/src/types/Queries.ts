export type NextApiQuery = Record<string, string | string[]>

export interface FilterQuery {
	status?: any;
	$text?: {
		$search: any;
	};
	'reward.amount'?: {
		$gte?: number;
		$lte?: number;
	};
}

