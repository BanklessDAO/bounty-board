import validate, { ValidatorProps } from './validate';
import authenticate from './authenticate';

export default function({ schema, handler }: ValidatorProps): ReturnType<typeof validate> {
	return validate({ schema, handler: authenticate(handler) });
}