import React from 'react';
import { Select } from '@chakra-ui/react';
import { CustomerProps } from '../../../types/Customer';

export const DAOSelector = ({ customers, customer, setCustomer }: {
	customers: CustomerProps[] | [],
	customer: CustomerProps;
	setCustomer(selected: CustomerProps): void
}): JSX.Element => {

	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const _customer = customers.find(({ CustomerName }) => CustomerName === event.target.value);
		_customer ? setCustomer(_customer) : null;
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