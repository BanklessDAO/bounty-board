export const title = 'Bankless Bounty Board';
const description = 'Bankless Bounty Board';
const url = 'https://bountyboard.bankless.community';

const SEO = {
	title,
	description,
	canonical: url,
	openGraph: {
		type: 'website',
		url,
		title,
		description,
		images: [
			{
				url: 'https://www.bankless.community/logo.svg',
				alt: title,
				width: 2048,
				height: 1170,
			},
		],
	},
	twitter: {
		cardType: 'summary_large_image',
		handle: '@banklessdao',
		site: '@banklessdao',
	},
	additionalLinkTags: [{ rel: 'icon', href: '/favicon.png' }],
};

export default SEO;
