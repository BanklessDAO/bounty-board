import { ObjectValues } from '@app/types';

export const BOUNTY_STATUS = {
	DRAFT: 'Draft',
	OPEN: 'Open',
	IN_PROGRESS: 'In-Progress',
	IN_REVIEW: 'In-Review',
	COMPLETED: 'Completed',
	DELETED: 'Deleted',
} as const;

export type BOUNTY_STATUS_VALUES = ObjectValues<typeof BOUNTY_STATUS>;

export default BOUNTY_STATUS;
