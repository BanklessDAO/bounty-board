import * as yup from 'yup';
import { ObjectSchema } from "yup";
import { ObjectShape } from "yup/lib/object";
import { TypedSchema } from "yup/lib/util/types";

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

export type InferInterface<TSchema> =
    InferInterfaceFromShape<InferShape<TSchema>>;