import { Customer } from '../../src/types/Customer';

export const customers: Customer[] = [
	{
		customerId: '834499078434979890',
		name: 'BanklessDAO',
	},
	{
		customerId: '402910780124561410',
		name: 'Compound',
		customization: {
			logo: 'https://cryptologos.cc/logos/compound-comp-logo.png',
			colors: {
				bg: {
					light: '#0AA3D8',
					dark: '#0A16D8',
				},
				primary: 'green',
				Open: 'yellow',
			},
		},
	},
	{
		customerId: '845400066532704256',
		name: 'Coordinape',
		customization: {
			logo: 'https://coordinape.com/imgs/logo/logo232.png',
			colors: {
				bg: {
					light: 'blue.200',
					dark: 'blue.800',
				},
				primary: '#0AA3D8',
				Open: 'blue',
			},
		},
	},
	{
		customerId: '718590743446290492',
		name: 'UMA',
		customization: {
			logo: 'https://umaproject.org/assets/images/UMA_square_red_logo.png',
			colors: {
				bg: {
					light: 'red.200',
					dark: 'red.800',
				},
				primary: '#cb5c5c',
				Open: 'blue',
			},
		},
	},
];