import { NextApiRequest } from 'next';
import { useEffect, useState, useRef, useCallback } from 'react';


export default {
	csvEncode(jObj: Record<string, unknown>): Record<string, unknown> {
		if (jObj) {
			const jStr = JSON.stringify(jObj, (key, value) => {
				if (typeof value === 'string') {
					return value.replace(/"/g, '""');
				}
				return value;
			});
			return JSON.parse(jStr);
		}
		return jObj;
	},

	boolFromReq(req: NextApiRequest, key: string): boolean {
		if (req.query) {
			const value = req.query[key];
			return value === undefined ? false : value.toString().toLowerCase() == 'true' || value.toString() == '1';
		}
		return false;
	},

	shortDate(date: Date): string {
		return date.toLocaleString('en-us', { month: 'short' }) + ' ' + date.getDate() + ', ' + date.getFullYear();
	},

	/**
	Define a set state function that runs a callback on setting of the state
	**/

	useStateCallback<T, C extends CallableFunction =(...args: any) => void>(initialState: T): [T, (state: T, cb: C) => void] {
		const [state, setState] = useState<T>(initialState);
		// init mutable ref container for callbacks
		const cbRef = useRef<C | null>(null);

		const setStateCallback = useCallback((s: T, cb: C) => {
			// store current, passed callback in ref
			cbRef.current = cb;
			// keep object reference stable, exactly like `useState`
			setState(s);
		}, []);

		useEffect(() => {
			// cb.current is `null` on initial render, 
			// so we only invoke callback on state *updates*
			if (cbRef.current) {
				cbRef.current(state);
				// reset callback after execution
				cbRef.current = null;
			}
		}, [state]);

		return [state, setStateCallback];
	},
};
