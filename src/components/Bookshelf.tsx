import { useEffect } from 'react';
import type { Book, BookItem, BookshelfItem } from '../types';
import useOpenLibraryAPI from '../hooks/useOpenLibraryAPI';

// Bookshelf detail page
export default function Bookshelf({
	name,
	books,
}: {
	name: string;
	books: BookItem[];
}) {
	const { getBookCoverImage } = useOpenLibraryAPI();
	useEffect(() => {
		console.log(books, '<<<');
	}, [books]);

	return (
		<div className="flex flex-col w-full h-full ">
			<div>{name}</div>
			<div>{books.length} books</div>
			{/* <button type="button">View bookshelf</button> */}
			<section className="flex gap-6 flex-wrap">
				{books.length > 0 &&
					books.map(({ book: b }: { book: Book }) => (
						<div className="flex flex-col max-w-40 " key={b.key}>
							<div className="w-full h-48">
								<img
									className="w-full h-full object-cover"
									src={getBookCoverImage(b.coverEditionKey)}
								/>
							</div>
							<div>Title: {b.title}</div>
							<div>Author: {b.author}</div>
							<div>Published: {b.publishedYear}</div>
						</div>
					))}
			</section>
		</div>
	);
}
