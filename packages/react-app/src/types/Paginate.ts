import { FilterQuery, Model, PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';

/**
 * Extends the starting mongoose model with an additional `paginate` method
 * @param T the interface of the MongoDB document (Bounty, Customer etc)
 * The other params are taken from the mongo documents and required to extend the type properly 
 */
export interface PaginateModel
<
  // Generics are equivalent of function arguments, but for types:
	T,
	TQueryHelpers = Record<string, unknown>,
	TMethods = Record<string, unknown>,
	TVirtuals = Record<string, unknown>
>
// here we are saying this new PaginatedModel extends the base mongoose Model
extends Model
<
  T,
  TQueryHelpers,
  TMethods
>
{
	aggregateFn<Options extends PaginateOptions>
  (
    // paginate takes 3 optional arguments: a standard Mongoose query, a set of options and a callback
		query?: FilterQuery<T>,
		options?: Options,
		callback?: PaginateCallback<T, TMethods, TVirtuals, Options>
    // it returns a promise containing a single page of a paginated document 
	): Promise<PaginateResult<PaginateDocument<T, TMethods, TVirtuals, Options>>>;
  // here we define the actual extendion to the type - a single method called 'paginate'
	paginate<Options extends PaginateOptions>
  (
    // paginate takes 3 optional arguments: a standard Mongoose query, a set of options and a callback
		query?: FilterQuery<T>,
		options?: Options,
		callback?: PaginateCallback<T, TMethods, TVirtuals, Options>
    // it returns a promise containing a single page of a paginated document 
	): Promise<PaginateResult<PaginateDocument<T, TMethods, TVirtuals, Options>>>;
}

// extracting the callback type out for readability
type PaginateCallback<
  T,
  TMethods,
  TVirtuals,
  Options
> = (err: any, result: PaginateResult<PaginateDocument<T, TMethods, TVirtuals, Options>>) => void;