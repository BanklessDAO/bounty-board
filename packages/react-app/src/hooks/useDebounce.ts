import { useState, useEffect, useRef } from 'react';

export const useDebounce = <T>(
	value: T,
	timeout: number,
	immediate?: boolean
): T => {
	const [state, setState] = useState<T>(value);
	const handler = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		if (handler.current) {
			clearTimeout(handler.current);
			handler.current = undefined;
		} else if (immediate) {
			setState(value);
		}

		handler.current = setTimeout(() => {
			setState(value);
			handler.current = undefined;
		}, timeout);
	}, [value, timeout, immediate]);

	return state;
};

export default useDebounce;
