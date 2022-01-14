import React, { useContext } from 'react';
import { Select } from '@chakra-ui/react';
import { CustomerProps } from '../../../models/Customer';
import { CustomerContext } from '../../../context/CustomerContext';
import router from 'next/router';

export const DAOSelector = ({ customers }: {
	customers: CustomerProps[] | [],
}): JSX.Element => {
	const { customer, setCustomer } = useContext(CustomerContext);

	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		/**
		 * When the user changes the DAO using the selector
		 * navigate to the homepage and update the customer to the newly selected DAO
		 */
		router.push('/');
		const _customer = customers.find(({ customerName }) => customerName === event.target.value);
		if (_customer && setCustomer) {
			setCustomer(_customer);
		} else {
			console.error('Attempted to change without initialising customer or setCustomer');
		}
	};

	return (
		<Select
			aria-label="dao-selector"
			mr="5"
			onChange={onChange}
			value={customer?.customerName ?? 'BanklessDAO'}
		>
			customers && {customers.map((option) => (
				<option key={option.customer_id} value={option.customerName}>
					{option.customerName}
				</option>
			))}
		</Select>
	);
};