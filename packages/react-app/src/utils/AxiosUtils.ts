import $http from 'axios';

/**
 * Globally configure outbound http settings here, saves on boilerplate
 */

const axios = $http.create({
	headers: {
		'Content-Type': 'application/json',
	},
});

export const axiosTokenFetcher = (url: string, token: string) => axios.get(
	// fetcher function with token
	url,
	{
		headers: {
			authorization: `Bearer ${token}`,
		},
	}
).then(res => res.data).catch(error => console.warn(error));


export const axiosFetcher = (url: string,) => axios.get(
	url,
)
// strips the messy data.data thing
	.then(({ data: res }) => res.data)
	.catch(error => {
		console.warn(error.message ?? error);
	});

export default axios;