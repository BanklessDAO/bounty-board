import { baseFilters, filtersDefined, getFiltersFromUrl, useDynamicUrl } from '@app/hooks/useUrlFilters';
import { ParsedUrlQuery } from 'querystring';
import { renderHook } from '@testing-library/react-hooks';
import { FilterParams } from '@app/types/Filter';
import { BANKLESS } from '@app/constants/Bankless';

describe('Testing URL Filters', () => {
	describe('Testing utils', () => {
		it('correctly tests if any of the filters are undefined', () => {
			const hasUndefined: ParsedUrlQuery = { test: 'undefined', value: 'I am defined' };
			expect(filtersDefined(hasUndefined)).toEqual(false);
		});

		it('Returns true if all filters defined', () => {
			const allDefined: ParsedUrlQuery = { test: 'All good', value: 'I am defined' };
			expect(filtersDefined(allDefined)).toEqual(true);
		});

		it('If invalid filters passed, applies defaults', () => {
			const input = {
				search: 'undefined',
			};
			expect(getFiltersFromUrl(input)).toEqual({ search: baseFilters.search });
		});
	});

	describe('Testing the dynamic URL', () => {

		it('renders', () => {
			renderHook(() => useDynamicUrl({} as FilterParams, true));
		});

		it('Returns a blank URL query if not ready', () => {
			const { result } = renderHook(() => useDynamicUrl({} as FilterParams, false));
			expect(result.current).toEqual('');
		});

		it('Adds the passed filters', () => {
			const filters: FilterParams = {
				search: 'TEST',
				asc: 'false',
				createdBy: '123456',
				customerId: BANKLESS.customerId,
				customerKey: BANKLESS.customerKey,
			};
			const { result } = renderHook(() => useDynamicUrl(filters, true));
			const expected = `?search=${filters.search}&asc=${filters.asc}&customerId=${filters.customerId}&customerKey=${filters.customerKey}&createdBy=${filters.createdBy}`;
			expect(result.current).toEqual(expected);
		});

		it('Ignores any customer filters', () => {
			const filters: FilterParams = {
				search: 'TEST',
				asc: 'false',
				createdBy: '123456',
				customerId: 'SHOULD NOT SHOW',
				customerKey: 'ALSO NO SHOW',
			};
			const { result } = renderHook(() => useDynamicUrl(filters, true));
			const expected = `?search=${filters.search}&asc=${filters.asc}&customerId=${BANKLESS.customerId}&customerKey=${BANKLESS.customerKey}&createdBy=${filters.createdBy}`;
			expect(result.current).toEqual(expected);
		});
	});
});
