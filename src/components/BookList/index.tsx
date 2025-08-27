import { useEffect, useState } from 'react';
import type { Book, BookItem } from '../../types';
import Modal from '../common/Modal';
import BookCard from './BookCard';
import { DEFAULT_BOOKSHELF_KEY } from '../../consts/books';

function BookList({ recommendations }: { recommendations: Book[] }) {
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [bookshelf, setBookshelf] = useState<Record<string, BookItem>>({});

	useEffect(() => {
		const initBookshelf = localStorage.getItem(DEFAULT_BOOKSHELF_KEY);
		// console.log(initBookshelf, '######### INIT bookshelf from storage');

		if (initBookshelf !== null) {
			setBookshelf(JSON.parse(initBookshelf));
		}
	}, []);

	useEffect(() => {
		// console.log('update local storage ###### [bookshelf]', bookshelf);
		if (Object.keys(bookshelf).length > 0) {
			console.log('save bookshelf to localstorage ########');
			localStorage.setItem(DEFAULT_BOOKSHELF_KEY, JSON.stringify(bookshelf));
		}
	}, [bookshelf]);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const showBookDetails = (book: Book) => {
		setSelectedBook(book);
		setIsModalOpen(true);
	};

	const isBookInBookshelf = ({ key }: Book) =>
		bookshelf?.[key] ? true : false;
	// removeFromBookshelf

	const addToBookshelf = (
		e: React.MouseEvent<HTMLButtonElement>,
		book: Book,
	) => {
		e.stopPropagation();
		// console.log('add to bookshelf', book, bookshelf);

		const newBookItem: BookItem = {
			id: book.key || 'UNKNOWN_KEY',
			book,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		setBookshelf((prevBookshelf) => ({
			...prevBookshelf,
			[newBookItem.id]: newBookItem,
		}));
	};

	return (
		<>
			<section
				className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 max-w-6xl mx-auto ${isModalOpen && 'overflow-hidden'}`}
			>
				{recommendations.map((book, idx) => (
					<BookCard
						key={idx}
						book={book}
						onClickHandler={() => showBookDetails(book)}
						// isBookInBookshelf={isBookInBookshelf}
						// addToBookshelf={addToBookshelf}
					/>
				))}
			</section>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<div>
					<p>Author: {selectedBook?.author}</p>
					<p>Title: {selectedBook?.title}</p>
				</div>
			</Modal>
		</>
	);
}

export default BookList;
