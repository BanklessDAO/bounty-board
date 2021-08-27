import { theme, extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
	sm: '425px',
	md: '768px',
	lg: '1080px',
	xl: '1280px',
	'2xl': '1440px',
});

const customTheme = extendTheme({
	fonts: {
		...theme.fonts,
		heading: `'Inter', ${theme.fonts.heading}`,
		body: `'Inter', ${theme.fonts.body}`,
	},
	fontSizes: {
		xs: '0.75rem',
		sm: '0.875rem',
		md: '1rem',
		lg: '1.125rem',
		xl: '1.25rem',
		'2xl': '1.5rem',
		'3xl': '1.875rem',
		'4xl': '2.25rem',
		'5xl': '3rem',
		'6xl': '3.75rem',
		'7xl': '4.5rem',
		'8xl': '6rem',
		'9xl': '8rem',
	},
	breakpoints,
	colors: {
		...theme.colors,
		Open: theme.colors.blue,
		'In-Review': theme.colors.purple,
		'In-Progress': theme.colors.green,
		Completed: theme.colors.green,
		Done: theme.colors.green,
		Deleted: theme.colors.red,
		Draft: theme.colors.gray,
	},
	components: {
		Heading: {
			sizes: {
				'4xl': {
					marginBottom: '1.5rem',
				},
				'2xl': {
					marginBottom: '1.5rem',
				},
				xl: {
					marginBottom: '1.5rem',
				},
				lg: {
					marginBottom: '1.5rem',
				},
				md: {
					marginBottom: '1rem',
				},
				sm: {
					marginBottom: '0.5rem',
				},
				xs: {
					marginBottom: '0.5rem',
				},
			},
		},
	},
});

export default customTheme;
