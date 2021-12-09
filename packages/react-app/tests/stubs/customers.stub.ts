import { CustomerProps } from '../../src/models/Customer';

export const customers: CustomerProps[] = [
	{
		customer_id: '834499078434979890',
		customerName: 'BanklessDAO',
		bountyChannel: '',
	},
	{
		customer_id: '402910780124561410',
		customerName: 'Compound',
		bountyChannel: '',
		customization: {
			logo: 'https://cryptologos.cc/logos/compound-comp-logo.png?v=014',
			colors: {
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
		customer_id: '845400066532704256',
		customerName: 'Coordinape',
		bountyChannel: '',
		customization: {
			logo: 'https://coordinape.com/imgs/logo/logo232.png',
			colors: {
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
		customer_id: '718590743446290492',
		bountyChannel: '',
		customerName: 'UMA',
		customization: {
			logo: 'https://umaproject.org/assets/images/UMA_square_red_logo.png',
			colors: {
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
		customer_id: '402910780129999',
		customerName: 'Should Not See',
		bountyChannel: '',
		customization: {
			logo: '',
			colors: {
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