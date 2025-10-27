import type { OpenLibrarySearchResponse } from '@/types';

function useOpenLibraryAPI() {
	const searchByKeyword = async ({
		keyword,
		limit = 30,
		page = 1,
	}: {
		keyword: string;
		limit?: number;
		page?: number;
	}) => {
		try {
			const response = await fetch(
				`https://openlibrary.org/search.json?q=${keyword} AND language:eng&limit=${limit}&page=${page}`,
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
	const fetchCoverImage = async ({
		key,
		id,
	}: {
		key: string | undefined;
		id: number | undefined;
	}) => {
		try {
			const url =
				typeof id === 'number'
					? `https://covers.openlibrary.org/b/id/${id}.jpg?default=false`
					: typeof key === 'string'
						? `https://covers.openlibrary.org/b/olid/${key}.jpg?default=false`
						: '';

			if (!url) {
				throw new Error('No valid cover ID or key provided');
			}

			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(url);
				img.onerror = () => reject(new Error('Failed to load cover image'));
				img.src = url;
			});
		} catch (err) {
			console.error(err);
			throw err;
		}
	};
	return { searchByKeyword, searchByQuery, fetchCoverImage };
}

export default useOpenLibraryAPI;
