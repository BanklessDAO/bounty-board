import { BANKLESS } from '@app/constants/Bankless';
import BOUNTY_STATUS, {
	BOUNTY_STATUS_VALUES,
} from '@app/constants/bountyStatus';
import PAID_STATUS, { PAID_STATUS_VALUES } from '@app/constants/paidStatus';
import { CustomerContext } from '@app/context/CustomerContext';
import { FilterParams } from '@app/types/Filter';
import { ParsedUrlQuery } from 'querystring';
import { useContext, useMemo } from 'react';
import useDebounce from './useDebounce';

const keysWithArrayVals = ['status', 'paidStatus'];
const keysWithNumberVals = ['gte', 'lte'];
const keysWithBooleanVals = ['asc'];
const validStatusKeys = Object.values(BOUNTY_STATUS);
const validPaidStatusKeys = Object.values(PAID_STATUS);

export const baseFilters: FilterParams = {
	search: '',
	status: [],
	paidStatus: [],
	gte: 0,
	lte: Infinity,
	sortBy: 'reward',
	asc: false,
	customerId: BANKLESS.customerId,
	customerKey: BANKLESS.customerKey,
	// no created or claimed
};

export const useDynamicUrl = (
	filters: FilterParams,
	bountiesChanged: boolean,
	ready: boolean
): string => {
	const { customer } = useContext(CustomerContext);
	const debounceSearch = useDebounce(filters.search, 500, true);

	return useMemo(() => {
		let urlQuery = '';

		if (ready) {
			const {
				status,
				paidStatus,
				lte,
				gte,
				sortBy,
				asc: sortAscending,
				claimedBy,
				createdBy,
			} = filters;

			if (status) urlQuery += `&status=${status || []}`;
			if (paidStatus) urlQuery += `&paidStatus=${paidStatus || []}`;
			if (debounceSearch) urlQuery += `&search=${debounceSearch}`;
			if (lte) urlQuery += `&lte=${lte}`;
			if (gte) urlQuery += `&gte=${gte}`;
			if (sortBy) urlQuery += `&sortBy=${sortBy}`;
			if (sortAscending || typeof sortAscending === 'boolean') {
				urlQuery += `&asc=${sortAscending}`;
			}
			if (customer) {
				urlQuery += `&customerId=${customer.customerId ?? BANKLESS.customerId}`;
			}
			if (customer) {
				urlQuery += `&customerKey=${
					customer.customerKey ?? BANKLESS.customerKey
				}`;
			}
			if (claimedBy) urlQuery += `&claimedBy=${claimedBy}`;
			if (createdBy) urlQuery += `&createdBy=${createdBy}`;

			// replace leading & to look nice
			if (urlQuery[0] === '&') urlQuery = '?' + urlQuery.substring(1);
		}
		return urlQuery;
	}, [filters, bountiesChanged, customer, debounceSearch, ready]);
};

const sanitizeFilter = (
	key: string,
	val: string | number | boolean
): string | string[] | boolean | number => {
	if (keysWithNumberVals.includes(key)) {
		return typeof val === 'number'
			? val
			: val === 'Infinity'
				? Infinity
				: parseInt(val as string, 10);
	}

	if (keysWithBooleanVals.includes(key)) return val == 'true' ? true : false;
	if (!keysWithArrayVals.includes(key) || typeof val !== 'string') return val;

	const arrayVal: any[] = val.split(',').map((v: string) => v.trim());
	switch (key) {
	case 'status':
		return Array.from(
			new Set(
				arrayVal.filter((s: BOUNTY_STATUS_VALUES) =>
					validStatusKeys.includes(s)
				)
			).values()
		);
	case 'paidStatus':
		return Array.from(
			new Set(
				arrayVal.filter((s: PAID_STATUS_VALUES) =>
					validPaidStatusKeys.includes(s)
				)
			).values()
		);
	default:
		return [];
	}
};

export const getFiltersFromUrl = (
	query: ParsedUrlQuery | FilterParams
): FilterParams =>
	Object.entries(query).reduce((prev, [key, val]) => {
		/**
     * Grab filters from the url, using fallback values if we see 'undefined'
     */
		const isValid = val && val !== 'undefined';
		const parsedVal = val && isValid ? sanitizeFilter(key, val) : val;
		const existing = baseFilters[key as keyof FilterParams];
		const adjVal = isValid ? parsedVal : existing;

		return {
			...prev,
			...{ [key]: adjVal },
		};
	}, {} as FilterParams);

export const filtersDefined = (query: ParsedUrlQuery): boolean =>
	!Object.values(query).some((item) => item === 'undefined');
