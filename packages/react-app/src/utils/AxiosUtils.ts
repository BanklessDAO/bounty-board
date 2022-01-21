import axios from 'axios';

/**
 * Globally configure outbound http settings here, saves on boilerplate
 */

export default axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
});

