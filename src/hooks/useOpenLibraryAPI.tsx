function useOpenLibraryAPI() {
	const search = async (keyword: string, limit: number = 100) => {
		// console.log('search keyword: ', keyword);

		/** SORT Options
		 * want_to_read
		 * rating
		 * new
		 * already_read
		 * random
		 */

		try {
			const response = await fetch(
				`https://openlibrary.org/search.json?q=${keyword} AND language:eng&sort=rating&limit=${limit}`,
			);

			if (response.status !== 200) {
				throw new Error();
			}

			const json = await response.json();
			// console.log(json, '<<<<<<<<<<<<<<<<<<<<< RESULT');
			return json;
		} catch (err) {
			console.error(err);
		}
	};

	// https://covers.openlibrary.org/b/$key/$value-$size.jpg
	const getBookCoverImage = ({
		key,
		id,
	}: {
		key: string | null;
		id: number | null;
	}) =>
		typeof id === 'number'
			? `https://covers.openlibrary.org/b/id/${id}.jpg`
			: typeof key === 'string'
				? `https://covers.openlibrary.org/b/olid/${key}.jpg`
				: '/fallbackImage.png';

	return {
		search,
		getBookCoverImage,
	};
}

export default useOpenLibraryAPI;
