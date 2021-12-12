import { FilterQuery, Model, PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';
import * as yup from 'yup';
import { TypedSchema } from 'yup/lib/util/types';

export type ToInterface<Schema extends TypedSchema> = yup.TypeOf<Schema>;

export type StripUndefined<YupModel> = {
	[K in keyof YupModel]: NonNullable<YupModel[K]>;
};

// pass in a typeof yup schema and convert all fields to required
export type SchemaToInterface<T extends TypedSchema> = StripUndefined<ToInterface<T>> & { _id?: string };

export interface PaginateModel<
	T,
	TQueryHelpers = Record<string, unknown>,
	TMethods = Record<string, unknown>,
	TVirtuals = Record<string, unknown>
> extends Model<T, TQueryHelpers, TMethods> {
	paginate<O extends PaginateOptions>(
		query?: FilterQuery<T>,
		options?: O,
		callback?: (err: any, result: PaginateResult<PaginateDocument<T, TMethods, TVirtuals, O>>) => void,
	): Promise<PaginateResult<PaginateDocument<T, TMethods, TVirtuals, O>>>;
}
