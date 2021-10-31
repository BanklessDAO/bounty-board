export const fetcher = (url: string): any =>
	fetch(url)
		.then(res => res.json())
		.then(json => json.data)
		.catch(err => console.warn(err));
