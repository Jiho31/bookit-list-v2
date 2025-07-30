function useOpenLibraryAPI() {
	const search = async (keyword: string) => {
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
				`https://openlibrary.org/search.json?q=${keyword} AND language:eng&sort=rating&limit=100`,
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
	const getBookCoverImage = (key: string) =>
		`https://covers.openlibrary.org/b/olid/${key}.jpg`;

	return {
		search,
		getBookCoverImage,
	};
}

export default useOpenLibraryAPI;
