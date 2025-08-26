import { useEffect } from 'react';
import type { Book, BookItem, BookshelfItem } from '../types';
import BookCard from './BookList/BookCard';

// Bookshelf detail page
export default function Bookshelf({
	name,
	books,
}: {
	name: string;
	books: BookItem[];
}) {
	useEffect(() => {
		console.log(books, '<<<');
	}, [books]);

	return (
		<div className="flex flex-col overflow-y-scroll">
			<h3 className="text-xl">{name}</h3>
			<div>{books.length} books</div>
			{/* <button type="button">View bookshelf</button> */}
			{books.length > 0 && (
				<section
					className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 max-w-6xl mx-auto `}
				>
					{books.map(({ book: b }: { book: Book }) => (
						<BookCard book={b} onClickHandler={() => {}} />
					))}
				</section>
			)}
		</div>
	);
}
