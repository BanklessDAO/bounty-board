import * as yup from 'yup';
import { TypedSchema } from 'yup/lib/util/types';

export type ToInterface<Schema extends TypedSchema> = yup.TypeOf<Schema>;

export type StripUndefined<YupModel> = {
	[K in keyof YupModel]: NonNullable<YupModel[K]>;
};

// pass in a typeof yup schema and convert all fields to required
export type SchemaToInterface<T extends TypedSchema> = StripUndefined<ToInterface<T>> & { _id?: string };
