import { CustomerProps } from '@app/models/Customer';
import { baseTheme, updateThemeForCustomer } from '@app/styles/customTheme';
import { useState, useEffect } from 'react';

export const useTheme = (customer?: CustomerProps): typeof baseTheme => {
	const [theme, setTheme] = useState(baseTheme);
	useEffect(() => {
		if (customer && typeof 'localStorage' !== undefined) {
			updateThemeForCustomer(customer, setTheme);
			localStorage.setItem('customer', JSON.stringify(customer));
		}
	}, [customer]);
	return theme;
};
