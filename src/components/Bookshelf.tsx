import { useEffect, useState } from 'react';
import type { Book, BookItem } from '../types';
import BookCard from './BookList/BookCard';
import { bookItemsMock } from '../consts/books';

// Bookshelf detail page
export default function Bookshelf({
	name,
	numOfBooks,
	id,
}: {
	name: string;
	numOfBooks: number;
	id: string;
}) {
	const [books, setBooks] = useState<BookItem[]>([]);
	useEffect(() => {
		// id 기준으로 bookshelf 에 있는 books 데이터 GET api
		setBooks(bookItemsMock);
	}, [id]);

	return (
		<div className="flex flex-col overflow-y-scroll p-10">
			<h3 className="text-xl font-semibold py-3">
				{name} ({numOfBooks})
			</h3>
			{numOfBooks > 0 ? (
				<section
					className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 max-w-6xl mx-auto `}
				>
					{books.map(({ book: b }: { book: Book }) => (
						<BookCard book={b} onClickHandler={() => {}} />
					))}
				</section>
			) : (
				<p>Bookshelf is empty!</p>
			)}
		</div>
	);
}
