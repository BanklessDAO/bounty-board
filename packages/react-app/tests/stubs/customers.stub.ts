import { CustomerProps } from '../../src/models/Customer';

export const customers: CustomerProps[] = [
	{
		CustomerId: '834499078434979890',
		CustomerName: 'BanklessDAO',
	},
	{
		CustomerId: '402910780124561410',
		CustomerName: 'Compound',
		Customization: {
			Logo: 'https://cryptologos.cc/logos/compound-comp-logo.png?v=014',
			Colors: {
				background: {
					light: '#0AA3D8',
					dark: '#0A16D8',
				},
				primary: 'green',
				Open: 'yellow',
			},
		},
	},
	{
		CustomerId: '845400066532704256',
		CustomerName: 'Coordinape',
		Customization: {
			Logo: 'https://coordinape.com/imgs/logo/logo232.png',
			Colors: {
				background: {
					light: 'blue.200',
					dark: 'blue.800',
				},
				primary: '#0AA3D8',
				Open: 'blue',
			},
		},
	},
	{
		CustomerId: '718590743446290492',
		CustomerName: 'UMA',
		Customization: {
			Logo: 'https://umaproject.org/assets/images/UMA_square_red_logo.png',
			Colors: {
				background: {
					light: 'red.200',
					dark: 'red.800',
				},
				primary: '#cb5c5c',
				Open: 'blue',
			},
		},
	},
	{
		CustomerId: '402910780129999',
		CustomerName: 'Should Not See',
		Customization: {
			Logo: '',
			Colors: {
				background: {
					light: '#0AA3D8',
					dark: '#0A16D8',
				},
				primary: 'green',
				Draft: 'yellow',
			},
		},
	},
];