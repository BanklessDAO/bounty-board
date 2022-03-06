import { ObjectValues } from '@app/types';

export const ACTIVITY = {
	CREATE: 'create',
	PUBLISH: 'publish',
	ASSIGN: 'assign',
	APPLY: 'apply',
	CLAIM: 'claim',
	SUBMIT: 'submit',
	COMPLETE: 'complete',
	DELETE: 'delete',
	LIST: 'list',
	HELP: 'help',
	TAG: 'tag',
	EDIT: 'edit',
} as const;

export const CLIENT = {
	BOUNTYBOARD: 'bountyboardweb',
};

export type ACTIVITY_VALUES = ObjectValues<typeof ACTIVITY>

export default ACTIVITY;
