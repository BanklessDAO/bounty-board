import { BANKLESS } from '@app/constants/Bankless';
import { CustomerContext } from '@app/context/CustomerContext';
import { FilterParams } from '@app/types/Filter';
import { ParsedUrlQuery } from 'querystring';
import { useContext, useMemo } from 'react';
import useDebounce from './useDebounce';

export const baseFilters: FilterParams = {
	search: '',
	status: 'All',
	gte: 0,
	lte: Infinity,
	sortBy: 'reward',
	asc: false,
	customerId: BANKLESS.customerId,
	customerKey: BANKLESS.customerKey,
	// no created or claimed
};

export const useDynamicUrl = (filters: FilterParams, ready: boolean): string => {
	const { customer } = useContext(CustomerContext);
	const debounceSearch = useDebounce(filters.search, 500, true);

	return useMemo(() => {
		let urlQuery = '';

		if (ready) {
			const { status, lte, gte, sortBy, asc: sortAscending, claimedBy, createdBy } = filters;

			if (status) urlQuery += `&status=${status === '' ? 'All' : status}`;
			if (debounceSearch) urlQuery += `&search=${debounceSearch}`;
			if (lte) urlQuery += `&lte=${lte}`;
			if (gte) urlQuery += `&gte=${gte}`;
			if (sortBy) urlQuery += `&sortBy=${sortBy}`;
			if (sortAscending) urlQuery += `&asc=${sortAscending}`;
			if (customer) urlQuery += `&customerId=${customer.customerId ?? BANKLESS.customerId}`;
			if (customer) urlQuery += `&customerKey=${customer.customerKey ?? BANKLESS.customerKey}`;
			if (claimedBy) urlQuery += `&claimedBy=${claimedBy}`;
			if (createdBy) urlQuery += `&createdBy=${createdBy}`;

			// replace leading & to look nice
			if (urlQuery[0] === '&') urlQuery = '?' + urlQuery.substring(1);
		}
		return urlQuery;

	}, [filters, customer, debounceSearch, ready]);
};

export const getFiltersFromUrl = (query: ParsedUrlQuery): FilterParams => Object.entries(query).reduce((prev, [key, val]) => {
	/**
	 * Grab filters from the url, using fallback values if we see 'undefined'
	 */
	const isValid = (val && val !== 'undefined');
	const existing = baseFilters[key as keyof FilterParams];
	const adjVal = isValid ? val : existing;
	return {
		...prev,
		...{ [key]: adjVal },
	};
}, {} as FilterParams);

export const filtersDefined = (query: ParsedUrlQuery): boolean => !Object.values(query).some(item => item === 'undefined');