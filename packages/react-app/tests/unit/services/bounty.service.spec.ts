import Bounty from '../../../src/models/Bounty';
import { FilterParams, SortParams } from '../../../src/types/Filter';
import { FilterQuery, NextApiQuery } from '../../../src/types/Queries';
import * as service from '../../../src/services/bounty.service';

describe('Testing the bounty service', () => {
  
	describe('Getting filters', () => {
		const query: NextApiQuery = {
			status: 'status',
			search: 'search',
			lte: '1',
			gte: '1',
			customer_id: 'customer_id',
		};
    
		it('Extracts status, search, lte, gte, customer_id from the query string', () => {
			const filters = service.getFilters(query);
			const { $lte, $gte, ...rest } = filters;
			expect(Object.keys(filters))
				.toEqual([...Object.keys(rest), '$lte', '$gte']);
      
			expect(typeof Object.values(rest)[0]).toBe('string');
			expect($lte).toEqual(1);
			expect($gte).toEqual(1);
		});

		it('Handles missing values okay', () => {
			const { lte, gte, ...notCustomerId } = query;
			const filters = service.getFilters(notCustomerId);
			expect(Object.keys(filters)).toEqual(Object.keys(notCustomerId));
			expect(lte).toEqual(gte);
		});

		it('Gracefully handles string arrays', () => {
			const queryArray: NextApiQuery = {
				status: ['Open', 'Draft'],
				search: 'search',
			};
			const filters = service.getFilters(queryArray);
			expect(filters).toEqual({ search: 'search' });
		});

		it('Gracefully exists when lte cannot be type coerced', () => {
			const notNumberQuery: NextApiQuery = {
				$lte: 'cannot coerce',
			};
			const filters = service.getFilters(notNumberQuery);
			expect(filters).toEqual({});
		});

		it('defaults to greater than 0', () => {
			const querygt0 = service.filterLessGreater({
				by: 'reward.amount',
				query: {},
			});
			expect(querygt0['reward.amount']).toEqual({ $gte: 0 });
		});

		it('otherwise applied $lte and $gte', () => {
			const queryltgt = service.filterLessGreater({
				by: 'reward.amount',
				query: {},
				$lte: 100,
				$gte: 100,
			});
			expect(queryltgt['reward.amount']).toEqual({ $gte: 100, $lte: 100 });
		});

	});

	describe('Testing sorts', () => {
		const sortQueries: NextApiQuery[] = ['false', '0', 'desc']
			.map(item => ({
				asc: item,
				sortBy: 'reward',
			}));

		it('Sorts descending falsy strings', () => {
			const expected: SortParams = {
				sortBy: 'reward.amount',
				order: 'desc',
			};
			sortQueries.forEach(query => {
				expect(service.getSort(query)).toEqual(expected);
			});
		});

		it('otherwise sorts ascending', () => {
			const query = {
				asc: 'literally anything else',
				sortBy: 'reward',
			};
			expect(service.getSort(query).order).toEqual('asc');
		});
	});

	describe('Search and status filters', () => {
		it('Sets status as array of values when nothing passed', () => {
			[undefined, '', 'All'].forEach(entry => {
				expect(
					service.filterStatus({}, entry).status
				)
					.toBeInstanceOf(Array);
			});
		});
  
		it('Else it returns the status', () => {
			const status = 'This could be anything';
			expect(service.filterStatus({}, status).status).toEqual(status);
		});
  
		it('returns the text search', () => {
			const search = 'This could be anything';
			expect(
				service.filterSearch({}, search).$text
			).toEqual({ $search: search });
		});
	});

	describe('The rest of the bounty service', () => {
		it('Returns a blank query if an empty object is passed', () => {
			const expectedEmpty = {
				$search: null,
				'reward.amount': undefined,
				status: '',
			};
			expect(service.handleEmpty(expectedEmpty)).toEqual({});
		});

		it('Returns the filters query object as expected', async () => {
			const filters: FilterParams = {
				status: 'Open',
				search: 'Test',
				customer_id: 'testId',
				$lte: 100,
				asc: true,
			};
			const expected: FilterQuery = {
				status: 'Open',
				customer_id: 'testId',
				$text: {
					$search: 'Test',
				},
				'reward.amount': {
					$lte: 100,
					$gte: 0,
				},
			};
			const spy = jest.spyOn(Bounty, 'find')
				.mockImplementation(jest.fn());
			await service.handleFilters(filters);
			expect(spy).toBeCalledWith(expected);
		});
	});
});
