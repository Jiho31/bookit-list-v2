import { useEffect, useState } from 'react';
import type { Book, BookItem, BookshelfItem } from '../types';
import BookCard from './BookList/BookCard';

export default function Bookshelf({
	name = '',
	numOfBooks = 0,
	key = '',
	books = [],
}: BookshelfItem) {
	const [booksData, setBooksData] = useState<BookItem[]>([]);
	useEffect(() => {
		setBooksData(books);
	}, [key]);

	return (
		<div className="flex flex-col overflow-y-scroll p-10">
			<h3 className="text-xl font-semibold py-3">
				{name} ({numOfBooks})
			</h3>
			{numOfBooks > 0 ? (
				<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 max-w-6xl mx-auto">
					{booksData.map(({ book: b }: { book: Book }) => (
						<BookCard book={b} onClickHandler={() => {}} />
					))}
				</section>
			) : (
				<p>Bookshelf is empty!</p>
			)}
		</div>
	);
}
