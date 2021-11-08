import theme from '@chakra-ui/theme';
import * as custom from '../../../src/styles/customTheme';

const { customizeTheme, baseTheme, getCustomColors } = custom;

describe('Testing custom styles', () => {

	it('returns the base theme if there are no color customizations', () => {
		const newTheme = customizeTheme({ logo: 'not a color customization' });
		// named functions are replaced by anon in spread, so we just test keys
		expect(Object.keys(newTheme)).toEqual(Object.keys(baseTheme));
	});

	it('Adds the background to the theme if passed', () => {
		const spy = jest.spyOn(custom, 'getCustomBackground');
		customizeTheme({ colors: { background: { light: 'red', dark: 'blue' } } });
		expect(spy).toHaveBeenCalled();
	});

	it('Adds supported customizations if passed', () => {
		const color = 'red';
		const newTheme = customizeTheme({ colors: { Open: color } });
		const newThemeColors = newTheme.colors;
		expect(newThemeColors.Open).not.toEqual(baseTheme.colors.Open);
		expect(newThemeColors.Open).toEqual(theme.colors[color]);
	});

	it('Generates a Chakra theme object if a hex code is passed', () => {
		const color = '#0AA3D8';
		const generatedThemeColor = custom.getColorFrom(color);
		const keys = Object.keys(generatedThemeColor);
		expect(keys).toEqual(['50', '100', '200', '300', '400', '500', '600', '700', '800']);
	});

	it('Returns a Chakra theme object if a string color is passed', () => {
		const color = 'red';
		const generatedThemeColor = custom.getColorFrom(color);
		expect(generatedThemeColor).toEqual(theme.colors[color]);
	});


	it('Returns an object containing only the passed values', () => {
		const customization = { Draft: 'blue', 'In-Review': 'green' };
		const customColors = getCustomColors(customization);
		const actualKeys = Object.keys(customColors);
		const expectedKeys = Object.keys(customization);
		expect(actualKeys.sort()).toEqual(expectedKeys.sort());
	});

	it('Ignores keys that are not recognised when getting custom colors', () => {
		const customization = { Test: 'blue', 'In-Review': 'green' };
		const customColors = getCustomColors(customization);
		const actualKeys = Object.keys(customColors);
		expect(actualKeys).toEqual(['In-Review']);
	});
});