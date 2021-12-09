import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { TypedSchema } from 'yup/lib/util/types';

export type InferShape<TSchema> =
    TSchema extends ObjectSchema<infer Shape> ? Shape : never;

export type UndefinableKeys<Shape extends ObjectShape> = string & {
    [K in keyof Shape]?:
    Shape[K] extends TypedSchema ?
    undefined extends yup.InferType<Shape[K]> ?
    K : never
    : never;
}[keyof Shape];

export type InferInterfaceFromShape<Shape extends ObjectShape> = {
    [K in UndefinableKeys<Shape>]?: Shape[K] extends TypedSchema ? yup.InferType<Shape[K]> : any;
} & {
    [K in Exclude<keyof Shape, UndefinableKeys<Shape>>]: Shape[K] extends TypedSchema ? yup.InferType<Shape[K]> : any;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// use this if you have no nested fields and want to make some fields optional
export type InferInterface<TSchema> = InferInterfaceFromShape<InferShape<TSchema>>;

// use this if you want to make a series of nested fields optional
export type InferSchemaOptionalObjects<TSchema, E extends keyof InferInterface<TSchema>> = PartialBy<InferInterface<TSchema>, E>;