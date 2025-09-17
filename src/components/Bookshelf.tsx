import { useEffect, useState } from 'react';
import type { Book, BookItem, BookshelfItem, CardButton } from '../types';
import BookCard from './BookList/BookCard';
import { useBookshelf } from '../contexts/BookshelfContext';
import { toast } from 'sonner';

type BookshelfProps = BookshelfItem & {
	bookshelfKey: string;
};

export default function Bookshelf({
	name = '',
	numOfBooks = 0,
	bookshelfKey,
	books = [],
}: BookshelfProps) {
	const [booksData, setBooksData] = useState<BookItem[]>([]);
	const [nameInput, setNameInput] = useState(name);
	const [isEditing, setIsEditing] = useState(false);
	const { deleteBookshelf, removeBookFromShelf, updateBookshelf } =
		useBookshelf();

	useEffect(() => {
		setBooksData(books);
	}, [bookshelfKey]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isEditing) {
			return;
		}

		setNameInput(e.target.value);
	};

	const validateNameValue = (name: string) => {
		if (name === '' || /\//.test(name)) {
			return false;
		}

		return true;
	};

	const handleSave = async () => {
		const newName = nameInput.trim();

		if (!validateNameValue(newName)) {
			toast.info('Bookshelf name cannot involve character(/) or be empty');
			return;
		}

		try {
			await updateBookshelf(bookshelfKey, newName);
			setIsEditing((val) => !val);
		} catch (err) {
			toast.error(err as string);
		}
	};

	const handleEditClick = () => {
		if (isEditing) {
			handleSave();
		} else {
			setIsEditing((val) => !val);
		}
	};

	const handleDeleteClick = async () => {
		const ok = confirm('Do you really want to delete this bookshelf?');

		if (!ok) {
			return;
		}

		try {
			await deleteBookshelf(bookshelfKey);

			location.reload();
			setTimeout(() => toast.success('Successfully deleted bookshelf'), 2000);
		} catch (err) {
			// console.error(err);
			toast.error('Failed to delete bookshelf. Refresh page and try again');
		}
	};

	const handleRemoveBook = async (e, { data }: { data: BookItem }) => {
		const ok = confirm('Do you really want to delete this book?');

		if (!ok) {
			return;
		}

		try {
			const bookId = data.id;
			if (!bookId) {
				throw new Error('Book id in invalid');
			}
			await removeBookFromShelf(bookshelfKey, bookId);

			toast.success('Successfully deleted book');

			setTimeout(() => location.reload(), 2000);
		} catch (err) {
			console.error(err);
			toast.error('Failed to remove book. Refresh page and try again');
		}
	};

	const buttons: CardButton[] = [
		{
			label: 'Add Memo',
			onClickHandler: () => {
				console.log('Open modal for new memo');
			},
		},
		{
			label: 'Delete',
			onClickHandler: handleRemoveBook,
		},
	];

	return (
		<div className="flex flex-col overflow-y-scroll p-10">
			<h3 className="text-xl font-semibold py-3 h-auto max-w-1/2 w-auto">
				<input
					className={`font-normal w-auto text-wrap text-ellipsis ${isEditing && 'border-b border-slate-600 focus:outline-none'} `}
					type="text"
					id="newName"
					value={nameInput}
					onChange={handleInputChange}
					readOnly={!isEditing}
					disabled={!isEditing}
				/>
				<span>({numOfBooks})</span>
				<button type="button" className="text-sm" onClick={handleEditClick}>
					{isEditing ? 'Save' : 'Edit'}
				</button>
				{isEditing && (
					<button type="button" onClick={handleDeleteClick}>
						Delete
					</button>
				)}
			</h3>
			{numOfBooks > 0 ? (
				<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 max-w-6xl mx-auto">
					{booksData.map((data: BookItem, idx) => (
						<BookCard
							key={idx}
							data={data}
							book={data.book}
							onClickHandler={() => {}}
							buttons={buttons}
						/>
					))}
				</section>
			) : (
				<p>Bookshelf is empty!</p>
			)}
		</div>
	);
}
