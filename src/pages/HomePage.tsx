import { useEffect, useState } from 'react';
import Bookshelf from '../components/Bookshelf';
import { type BookshelfItem } from '../types';
import { DEFAULT_BOOKSHELF_ITEM, DEFAULT_BOOKSHELF_KEY } from '../consts/books';

export default function HomePage() {
	const [bookshelfList, setBookshelfList] = useState<BookshelfItem[]>([]);

	useEffect(() => {
		// initialize books

		const data = localStorage.getItem(DEFAULT_BOOKSHELF_KEY);
		if (data) {
			// setBooks(Object.values(JSON.parse(data)));
			const parsed = JSON.parse(data);
			console.log(parsed, '<<<< from LOCAL STORAGE');

			// setBookshelfList(parsed);
		} else {
			const newBookshelf = {
				...DEFAULT_BOOKSHELF_ITEM,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			setBookshelfList([newBookshelf]);
		}
	}, []);

	return (
		<>
			<div>side bar</div>
			{bookshelfList.length > 0 ? (
				bookshelfList.map((b) => (
					<Bookshelf key={b.key} name={b.name} books={b.books} />
				))
			) : (
				<div>Empty</div>
			)}
		</>
	);
}
