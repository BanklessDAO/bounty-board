import React from 'react';
import { Select } from '@chakra-ui/react';
import { Customer } from '../../../types/Customer';

export const DAOSelector = ({ customers, customer, setCustomer }: {
	customers: Customer[],
	customer: Customer;
	setCustomer(selected: Customer): void
}): JSX.Element => {

	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const _customer = customers.find(c => c.name === event.target.value);
		_customer ? setCustomer(_customer) : null;
	};

	return (
		<Select
			mr="5"
			onChange={onChange}
			value={customer?.name ?? 'BanklessDAO'}
			>
			{customers.map((option) => (
				<option key={option.customerId} value={option.name}>
					{option.name}
				</option>
			))}
		</Select>
	)
};