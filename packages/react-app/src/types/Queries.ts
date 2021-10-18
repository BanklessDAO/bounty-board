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

