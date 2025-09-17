import { useState } from 'react';
import type { Book, CardButton } from '../../types';
import Modal from '../common/Modal';
import BookCard from './BookCard';
import { useBookshelf } from '../../contexts/BookshelfContext';
import { toast } from 'sonner';

function BookList({ recommendations }: { recommendations: Book[] }) {
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { addBookToShelf } = useBookshelf();

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const showBookDetails = (book: Book) => {
		setSelectedBook(book);
		setIsModalOpen(true);
	};

	const addToBookshelf = async (
		e: React.MouseEvent<HTMLButtonElement>,
		{ book }: { book: Book },
	) => {
		e.stopPropagation();

		try {
			const ok = await confirm('Add book to default bookshelf?');
			if (!ok) return;

			// await addBookToShelf(DEFAULT_BOOKSHELF_KEY, book);
			await addBookToShelf(book);
		} catch (err) {
			if (typeof err === 'string') {
				toast.info(err);
			} else {
				console.error(err);
			}
		}
	};

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
