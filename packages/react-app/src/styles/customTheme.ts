import { theme, extendTheme, ChakraTheme } from '@chakra-ui/react';
import { createBreakpoints, mode } from '@chakra-ui/theme-tools';
import { Customization, LightDark, SupportedColorCustomizations } from '../types/Customer';

const breakpoints = createBreakpoints({
	sm: '425px',
	md: '768px',
	lg: '1080px',
	xl: '1280px',
	'2xl': '1440px',
});

export const baseTheme = extendTheme({
	fonts: {
		...theme.fonts,
		heading: `'Inter', ${theme.fonts.heading}`,
		body: `'Inter', ${theme.fonts.body}`,
		mono: 'Menlo, monospace',
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
		primary: theme.colors.gray,
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

export const getCustomBackground = (colors: LightDark): Partial<ChakraTheme> => ({
	// https://chakra-ui.com/docs/features/global-styles
	styles: {
		global: (props) => ({
			body:{
				bg: mode(colors.light, colors.dark)(props)
			}
		})
	}
})

export const getCustomColors = (colors: SupportedColorCustomizations): Record<string, string> => {
	/**
	 * @param colors is the colors we want to customize
	 * Looks up the list of colors we currently support, from the base theme
	 * @returns an object mapping our passed customizations, to chakra theme colors
	 */
	const supportedVariants = Object.keys(baseTheme.colors);
	const colorCustomizations = supportedVariants
		// @ts-ignore
		.filter(variant => colors[variant] !== undefined)
		// @ts-ignore
		.map(variant => ({ [variant]: theme.colors[colors[variant]] }));

	return Object.assign({}, ...colorCustomizations);
}

export const customizeTheme = (customization: Customization) => {
	/**
	 * @param customization is an object containing all the theme customizations we want to support
	 * Goes through and creates an overwrite of the base theme, with our additional customizations.
	 * @returns the new theme object
	 */
	let customColors = {} as Record<string, string>;
	let customBackground = {} as Partial<ChakraTheme>;

	const { colors } = customization;
	if (colors) {
		customColors = getCustomColors(colors);
		if (colors.bg) {
			customBackground = getCustomBackground(colors.bg);
		}
	}
	const customTheme = {
		...baseTheme,
		...customBackground,
		colors: {
			...baseTheme.colors,
			...customColors,
		}
	}
	const newTheme = extendTheme(customTheme);
	return newTheme
}