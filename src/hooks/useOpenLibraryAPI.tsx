import type { OpenLibrarySearchResponse } from '@/types';

function useOpenLibraryAPI() {
	const searchByKeyword = async (keyword: string, limit: number = 100) => {
		try {
			const response = await fetch(
				`https://openlibrary.org/search.json?q=${keyword} AND language:eng&limit=${limit}`,
			);

			if (response.status !== 200) {
				throw new Error();
			}

			const json = (await response.json()) as OpenLibrarySearchResponse;
			return json;
		} catch (err) {
			console.error(err);
		}
	};

	const searchByQuery = async (keyword: string, limit: number = 100) => {
		const sortOptions = ['want_to_read', 'rating', 'random'];
		const getRandomIndex = (max: number) => {
			return Math.floor(Math.random() * max);
		};

		try {
			const sortBy = sortOptions[getRandomIndex(sortOptions.length)];
			const response = await fetch(
				`https://openlibrary.org/search.json?q=${keyword} AND language:eng&sort=${sortBy}&limit=${limit}`,
			);

			if (response.status !== 200) {
				throw new Error();
			}

			const json = (await response.json()) as OpenLibrarySearchResponse;
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

	return { searchByKeyword, searchByQuery, getBookCoverImage };
}

export default useOpenLibraryAPI;
