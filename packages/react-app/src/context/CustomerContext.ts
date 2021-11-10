import { BANKLESS } from '../constants/Bankless';
import { CustomerProps } from '../models/Customer';
import { createContext, Dispatch, SetStateAction } from 'react';

type CustomerContextProps = {
  customer: CustomerProps;
  setCustomer?: Dispatch<SetStateAction<CustomerProps>>;
}

export const CustomerContext = createContext<CustomerContextProps>({
	customer: BANKLESS,
});

export const getDefaultCustomer = (): CustomerProps => {
	if (typeof window !== 'undefined') {
		const customer = localStorage.getItem('customer');
		return customer ? JSON.parse(customer) : BANKLESS;
	}
	return BANKLESS;
};