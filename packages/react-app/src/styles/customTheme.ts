import { theme, extendTheme, ChakraTheme, Colors } from '@chakra-ui/react';
import { createBreakpoints, mode } from '@chakra-ui/theme-tools';
import { CustomerProps, Customization, LightDark, SupportedColorCustomizations } from '../models/Customer';

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
		primary: theme.colors.teal,
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
				bg: mode(colors.light, colors.dark)(props),
			},
		}),
	},
});

const shadeHexColor = (color: string, percent: number): string => {
	/**
	 * Shamlessly taken from:
	 * https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
	 */
	const f = parseInt(color.slice(1), 16);
	const t = percent < 0 ? 0 : 255;
	const p = percent < 0 ? percent * -1 : percent;
	const R = f >> 16, G = f >> 8 & 0x00FF;
	const B = f & 0x0000FF;
	const output = '#' + (
		0x1000000 + (Math.round((t - R) * p) + R)
		* 0x10000 + (Math.round((t - G) * p) + G)
		* 0x100 + (Math.round((t - B) * p) + B)
	)
		.toString(16)
		.slice(1)
		.toUpperCase();
	return output;
};


export const getColorFrom = (colorVariant: string | undefined | LightDark): Colors => {
	/**
	 * @param colorVariant is a string either `"red"` or a Hex `"#FFF"
	 * Takes in the variant and checks to see if we have a match in chakra,
	 * if not, generates a new color object on the fly
	 * @returns a Chakra UI color object
	 */
	// we know variant wont be undefined, so have to recast it
	const variant = colorVariant as string;
	// keep typescript happy by casting theme.colors object as any
	const { colors } = theme as any;
	const themeColor = colors[variant];
	
	if (!themeColor) {
		return {
			50: shadeHexColor(variant, 0.35),
			100: shadeHexColor(variant, 0.3),
			200: shadeHexColor(variant, 0.2),
			300: shadeHexColor(variant, 0.1),
			400: shadeHexColor(variant, 0),
			500: shadeHexColor(variant, -0.1),
			600: shadeHexColor(variant, -0.2),
			700: shadeHexColor(variant, -0.3),
			800: shadeHexColor(variant, -0.4),
		};
	}
	return themeColor;
};

export const getCustomColors = (colors: SupportedColorCustomizations): Record<string, Colors> => {
	/**
	 * @param colors is the colors we want to customize
	 * Looks up the list of colors we currently support, from the base theme
	 * @returns an object mapping our passed customizations, to chakra theme colors
	 */
	type colorKey = keyof SupportedColorCustomizations;
	const supportedVariants = Object.keys(baseTheme.colors);

	const colorCustomizations = supportedVariants
		.filter(variant => colors[variant as colorKey] !== undefined)
		.map(variant => ({
			[variant]: getColorFrom(colors[variant as colorKey]),
		}));
	
	return Object.assign({}, ...colorCustomizations);
};

export const customizeTheme = (customization: Customization): Record<string, any> => {
	/**
	 * @param customization is an object containing all the theme customizations we want to support
	 * Goes through and creates an overwrite of the base theme, with our additional customizations.
	 * @returns the new theme object
	 */
	let customColors = {} as Record<string, Colors>;
	let customBackground = {} as Partial<ChakraTheme>;

	const { colors } = customization;
	if (colors) {
		customColors = getCustomColors(colors);
		if (colors.background) {
			customBackground = getCustomBackground(colors.background);
		}
	}
	const customTheme = {
		...baseTheme,
		...customBackground,
		colors: {
			...baseTheme.colors,
			...customColors,
		},
	};
	const newTheme = extendTheme(customTheme);
	return newTheme;
};

export const updateThemeForCustomer = (
	customer: CustomerProps,
	setTheme: (t: typeof baseTheme) => void
): void => {
	let newTheme = baseTheme;
	const { customization } = customer;
	if (customization) {
		newTheme = customizeTheme(customization);
	}
	setTheme(newTheme);
};
