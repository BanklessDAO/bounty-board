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
};
