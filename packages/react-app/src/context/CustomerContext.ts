import { BANKLESS } from '../constants/Bankless';
import { CustomerProps } from '../models/Customer';
import { createContext, Dispatch, SetStateAction } from 'react';

export type SetCustomerType = Dispatch<SetStateAction<CustomerProps>>;

type CustomerContextProps = {
  customer: CustomerProps;
  setCustomer?: SetCustomerType;
};

export const CustomerContext = createContext<CustomerContextProps>({
	customer: BANKLESS,
});
