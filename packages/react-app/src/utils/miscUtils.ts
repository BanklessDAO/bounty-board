import { NextApiRequest } from 'next';

export default {
	csvEncode(jObj: Record<string, unknown>): Record<string, unknown> {
		if (jObj) {
			const jStr = JSON.stringify(jObj, (key, value) => {
				if (typeof value === 'string') {
					return value.replace(/"/g, '""');
				}
				return value;
			});
			return JSON.parse(jStr);
		}
		return jObj;
	},

	boolFromReq(req: NextApiRequest, key: string): boolean {
		if (req.query) {
			const value = req.query[key];
			return value === undefined ? false : value.toString().toLowerCase() == 'true' || value.toString() == '1';
		}
		return false;
	},

	shortDate(date: Date): string {
		return date.toLocaleString('en-us', { month: 'short' }) + ' ' + date.getDate() + ', ' + date.getFullYear();
	},
};
