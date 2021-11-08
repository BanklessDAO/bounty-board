import React, { useContext } from 'react';
import { Select } from '@chakra-ui/react';
import { CustomerProps } from '../../../models/Customer';
import { CustomerContext } from '../../../context/CustomerContext';

export const DAOSelector = ({ customers }: {
	customers: CustomerProps[] | [],
}): JSX.Element => {
	const { customer, setCustomer } = useContext(CustomerContext);

	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const _customer = customers.find(({ customerName }) => customerName === event.target.value);
		if (_customer && setCustomer) {
			setCustomer(_customer);
		} else {
			console.error('Attempted to change without initialising customer or setCustomer');
		}
	};

	return (
		<Select
			mr="5"
			onChange={onChange}
			value={customer?.customerName ?? 'BanklessDAO'}
		>
			{customers.map((option) => (
				<option key={option.customerId} value={option.customerName}>
					{option.customerName}
				</option>
			))}
		</Select>
	);
};