import { useEffect, useState } from 'react';
import type { BookItem, BookshelfItem, CardButton } from '../types';
import BookCard from './BookList/BookCard';
import { useBookshelf } from '../contexts/BookshelfContext';
import { toast } from 'sonner';

type BookshelfProps = BookshelfItem & {
	bookshelfKey: string;
	toggleSidebar: () => void;
};

export default function Bookshelf({
	name = '',
	numOfBooks = 0,
	bookshelfKey,
	books = [],
	toggleSidebar,
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

	const handleRemoveBook = async ({ data }: { data: BookItem }) => {
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

			setTimeout(() => location.reload(), 500);
		} catch (err) {
			console.error(err);
			toast.error('Failed to remove book. Refresh page and try again');
		}
	};

	const handleAddMemo = () => {
		toast('🛠️ This feature is currently being developed. Thank you. ');
	};

	const buttons: CardButton[] = [
		{
			label: 'Add Memo',
			onClickHandler: handleAddMemo,
		},
		{
			label: 'Delete',
			onClickHandler: handleRemoveBook,
		},
	];

	return (
		<div className="relative flex flex-col gap-4 overflow-y-scroll p-10 w-full">
			<div className="flex gap-0.5 justify-between items-center text-xl font-semibold py-3 h-auto w-full">
				<button
					type="button"
					className="block md:hidden mr-2 bg-slate-200 hover:bg-slate-300 text-sm text-slate-600 border-slate-400"
					onClick={toggleSidebar}
				>
					<svg
						role="img"
						aria-labelledby="sidebar-menu-buton"
						className="fill-current w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -960 960 960"
					>
						<title id="sidebar-menu-buton">menu</title>
						<path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
					</svg>
				</button>
				<h3 className="flex w-full sm:w-full max-w-[90%]">
					<input
						className={`font-normal w-[90%] sm:w-[60%] text-wrap text-ellipsis ${isEditing && 'border-b border-slate-600 focus:outline-none'} `}
						type="text"
						id="newName"
						value={nameInput}
						onChange={handleInputChange}
						readOnly={!isEditing}
						disabled={!isEditing}
						maxLength={40}
					/>
					<span className="shrink-0">({numOfBooks})</span>
				</h3>
				<div className="inline-flex gap-1.5">
					<button
						type="button"
						className="bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-600 w-auto min-w-[40px] h-[32px] flex justify-center items-center p-2"
						onClick={handleEditClick}
					>
						{isEditing ? (
							<svg
								className="fill-current"
								aria-labelledby="save-button"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								height="20px"
								viewBox="0 -960 960 960"
								width="20px"
							>
								<path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
								<title id="save-button">Save changes</title>
							</svg>
						) : (
							<>
								<svg
									className="fill-current"
									role="img"
									aria-labelledby="edit-button"
									xmlns="http://www.w3.org/2000/svg"
									height="20px"
									viewBox="0 -960 960 960"
									width="20px"
								>
									<title id="edit-button">Edit</title>
									<path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
								</svg>
								<span className="hidden sm:block ml-1 text-sm">Edit</span>
							</>
						)}
					</button>
					{isEditing && (
						<button
							type="button"
							className="bg-red-500 text-red-50 hover:bg-red-600 hover:text-white  w-auto min-w-[40px] h-[32px] flex justify-center items-center p-2"
							onClick={handleDeleteClick}
						>
							<svg
								className="fill-current"
								aria-labelledby="delete-button"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								height="20px"
								viewBox="0 -960 960 960"
								width="20px"
							>
								<path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
								<title id="delete-button">Delete</title>
							</svg>
						</button>
					)}
				</div>
			</div>
			{numOfBooks > 0 ? (
				<section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-full sm:max-w-4xl">
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
				<p className="text-slate-800 py-4">Bookshelf is empty!</p>
			)}
		</div>
	);
}
