import type { Book, CardButton } from '../../types';
import BookCard from './BookCard';
import { useBookshelf } from '../../contexts/BookshelfContext';
import { toast } from 'sonner';
import { useModal } from '../../contexts/ModalContext';

function BookDetailsModal({ book, close }: { book: Book; close: () => void }) {
	return (
		<div>
			<p>Author: {book.author}</p>
			<p>Title: {book.title}</p>
			<button className="mt-4" onClick={close}>
				Close
			</button>
		</div>
	);
}

function BookList({ recommendations }: { recommendations: Book[] }) {
	const { addBookToShelf } = useBookshelf();
	const { openModal } = useModal();

	const showBookDetails = (book: Book) => {
		openModal({ component: BookDetailsModal, props: { book } });
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
		<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl sm:max-w-full mx-auto">
			{recommendations.map((book) => (
				<BookCard
					key={book.key}
					book={book}
					onClickHandler={() => showBookDetails(book)}
					buttons={buttons}
				/>
			))}
		</section>
	);
}

export default BookList;
