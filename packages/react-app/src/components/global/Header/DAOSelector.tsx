import React, { useContext } from 'react';
import { Select } from '@chakra-ui/react';
import { CustomerProps } from '../../../models/Customer';
import { CustomerContext } from '../../../context/CustomerContext';

export const DAOSelector = ({ customers }: {
	customers: CustomerProps[] | [],
}): JSX.Element => {
	const { customer, setCustomer } = useContext(CustomerContext);

	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const _customer = customers.find(({ CustomerName }) => CustomerName === event.target.value);
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
			value={customer?.CustomerName ?? 'BanklessDAO'}
		>
			{customers.map((option) => (
				<option key={option.CustomerId} value={option.CustomerName}>
					{option.CustomerName}
				</option>
			))}
		</Select>
	);
};