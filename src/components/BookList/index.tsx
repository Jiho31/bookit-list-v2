import { useEffect, useState } from 'react';
import type { Book, CardButton } from '../../types';
import Modal from '../common/Modal';
import BookCard from './BookCard';
import { DEFAULT_BOOKSHELF_KEY } from '../../consts/books';
import { useBookshelf } from '../../contexts/BookshelfContext';

function BookList({ recommendations }: { recommendations: Book[] }) {
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [bookshelf, setBookshelf] = useState<BookshelfItem | null>(null);
	const { fetchBookshelf, addBookToShelf } = useBookshelf();

	const initDefaultBookshelf = async () => {
		const initBookshelf = await fetchBookshelf(DEFAULT_BOOKSHELF_KEY);

		if (initBookshelf) {
			setBookshelf(initBookshelf);
		}
	};

	useEffect(() => {
		initDefaultBookshelf();
	}, []);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const showBookDetails = (book: Book) => {
		setSelectedBook(book);
		setIsModalOpen(true);
	};

	const addToBookshelf = async (
		e: React.MouseEvent<HTMLButtonElement>,
		book: Book,
	) => {
		e.stopPropagation();
		const ok = await confirm('Add book to default bookshelf?');
		if (!ok) return;

		const newBookItem: BookItem = {
			id: book.key || 'UNKNOWN_KEY',
			book,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		await addBookToShelf(DEFAULT_BOOKSHELF_KEY, newBookItem);

		setBookshelf((prevBookshelf) =>
			prevBookshelf

	const buttons: CardButton[] = [
		{
			label: 'Add to bookshelf',
			onClickHandler: addToBookshelf,
		},
	];

	return (
		<>
			<section
				className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl sm:max-w-full mx-auto ${isModalOpen && 'overflow-hidden'}`}
			>
				{recommendations.map((book) => (
					<BookCard
						key={book.key}
						book={book}
						onClickHandler={() => showBookDetails(book)}
						buttons={buttons}
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
