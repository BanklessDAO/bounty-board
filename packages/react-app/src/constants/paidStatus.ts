import { ObjectValues } from '@app/types';

export const PAID_STATUS = {
	UNPAID: 'Unpaid',
	PAID: 'PAID',
} as const;

export type PAID_STATUS_VALUES = ObjectValues<typeof PAID_STATUS>;

export default PAID_STATUS;
