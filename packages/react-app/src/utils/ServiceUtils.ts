export default {
	formatDisplayDate(dateIso: string): string {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		};
		return new Date(dateIso).toLocaleString('en-US', options);
	},
	getMongoURI(): string {
		const uri = process.env.MONGODB_URI;
		return uri || '';
	},
};
