type LocalStorageReturn<T extends any> = {
  loading: boolean;
  data: T | undefined;
};

export function useLocalStorage<T>(key: string): LocalStorageReturn<T> {
	/**
   * Retrieving values from local storage on server side will throw errors
   * Wait for client side render (loading === false)
   * And fetch data if exists, passing the loading flag to the component if needed
   */
	let data = undefined;
	let loading = true;
	if (typeof localStorage !== 'undefined') {
		const item = localStorage.getItem(key);
		if (item) data = JSON.parse(item);
		loading = false;
	}
	return { loading, data };
}
