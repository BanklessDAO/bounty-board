import validate, { ValidatorProps } from './validate';
import authenticate from './authenticate';

/**
 * @param schema is the yup schema to validate the incoming data
 * @param handler is the route handler *
 * @param restrictions the role restrictions object. Optionally pass to set a list of roles against which the
 * 	route will be restricted.
 * @dev note that restrictions will not have effect at this time.
 */
export default function({
	schema,
	handler,
	restrictions: restrictions,
}: ValidatorProps): ReturnType<typeof validate> {
	return validate({
		schema,
		handler: authenticate(handler, restrictions),
	});
}
