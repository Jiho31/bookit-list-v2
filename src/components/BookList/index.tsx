import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Book, CardButton } from '../../types';
import BookCard from './BookCard';
import { useBookshelf } from '../../contexts/BookshelfContext';
import { useModal } from '../../contexts/ModalContext';
import { useAuth } from '@/contexts/AuthContext';
import RegisterModal from '../RegisterModal';

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

function BookList({ data }: { data: Book[] }) {
	const { openModal, closeModal } = useModal();
	const { isAuthenticated } = useAuth();

	const handleAddBook = ({
		e,
		book,
	}: {
		e: React.MouseEvent<HTMLButtonElement>;
		book: Book;
	}) => {
		e.stopPropagation();

		if (isAuthenticated) {
			openModal({ component: BookshelfListModal, props: { book } });
		} else {
			openModal({ component: RegisterModal });
		}
	};

	const buttons: CardButton[] = [
		{
			label: 'Add to bookshelf',
			onClickHandler: handleAddBook,
			icon: (
				<svg
					role="img"
					aria-labelledby="add-bookmark-button"
					className="fill-current"
					xmlns="http://www.w3.org/2000/svg"
					height="20px"
					viewBox="0 -960 960 960"
					width="20px"
				>
					<title id="add-bookmark-button">Add book</title>
					<path d="M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
				</svg>
			),
		},
	];

	useEffect(() => {
		return () => closeModal();
	}, [closeModal]);

	return (
		<section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-full sm:max-w-4xl mx-auto">
			{data.map((book) => (
				<BookCard key={book.key} book={book} buttons={buttons} />
			))}
		</section>
	);
}

export default BookList;
