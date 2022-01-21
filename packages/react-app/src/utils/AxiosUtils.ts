import $http from 'axios';

/**
 * Globally configure outbound http settings here, saves on boilerplate
 */

const axios = $http.create({
	headers: {
		'Content-Type': 'application/json',
	},
});

export const axiosFetcher = (url: string,) => axios.get(
	url,
)
// strips the messy data.data thing
	.then(({ data: res }) => res.data);
// .catch(error => error);

export default axios;