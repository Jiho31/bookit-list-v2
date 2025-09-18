import { useState } from 'react';
import { toast } from 'sonner';
import type { Book, CardButton } from '../../types';
import BookCard from './BookCard';
import { useBookshelf } from '../../contexts/BookshelfContext';
import { useModal } from '../../contexts/ModalContext';

function BookshelfListModal({
	book,
	close,
}: {
	book: Book;
	close: () => void;
}) {
	const { list, addBookToShelf } = useBookshelf();
	const [targetKey, setTargetKey] = useState('');

	const addToBookshelf = async () => {
		if (targetKey === '') {
			toast.info('You have to select one bookshelf');
			return;
		}

		try {
			await addBookToShelf(targetKey, book);
			toast.success('Successfully added book to bookshelf');
		} catch (err) {
			if (typeof err === 'string') {
				toast.info(err);
			} else {
				console.error(err);
			}
		} finally {
			close();
		}
	};

	return (
		<div className="flex flex-col gap-2 w-[350px] h-auto max-h-2/3 overflow-scroll bg-slate-200 p-5 rounded-2xl">
			<h2 className="text-md font-semibold py-1 mb-5">Add to bookshelf</h2>
			<ul className="w-full flex flex-col gap-1.5">
				{list.map((item) => (
					<li
						className={`rounded-lg px-3 py-2 text-sm ${item.key === targetKey ? 'bg-indigo-400 text-indigo-50' : 'bg-white'}  hover:bg-indigo-600 hover:text-indigo-50 cursor-pointer`}
						key={item.key}
						onClick={() => setTargetKey(item.key)}
					>
						{item.name} ({item.numOfBooks})
					</li>
				))}
			</ul>
			<button className="mt-2 w-min self-center" onClick={addToBookshelf}>
				Add
			</button>
			<button
				className="text-slate-800 bg-slate-200 absolute top-5 right-5 p-2"
				onClick={close}
			>
				X
			</button>
		</div>
	);
}

function BookList({ recommendations }: { recommendations: Book[] }) {
	const { openModal } = useModal();

	const handleAddBook = (
		e: React.MouseEvent<HTMLButtonElement>,
		{ book }: { book: Book },
	) => {
		e.stopPropagation();

		openModal({ component: BookshelfListModal, props: { book } });
	};

	const buttons: CardButton[] = [
		{
			label: 'Add to bookshelf',
			onClickHandler: handleAddBook,
		},
	];

	return (
		<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl sm:max-w-full mx-auto">
			{recommendations.map((book) => (
				<BookCard key={book.key} book={book} buttons={buttons} />
			))}
		</section>
	);
}

export default BookList;
