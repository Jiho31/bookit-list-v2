import { createContext, useContext, useEffect, useState } from 'react';
import type { BookItem, BookshelfItem } from '../types';
import {
	BOOKSHELF_LIST_KEY,
	DEFAULT_BOOKSHELF_ITEM,
	DEFAULT_BOOKSHELF_KEY,
} from '../consts/books';

type BookshelfCtx = {
	activeKey: string;
	list: BookshelfItem[];
	createBookshelf: (name: string) => void;
	addToBookshelf: (book: BookItem) => Promise<void>;
	removeFromBookshelf: (key: string) => Promise<void>;
	// isLoading: boolean;
	// error: Error | null;
};

const BookshelfContext = createContext<BookshelfCtx | undefined>(undefined);

const BookshelfProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeKey, setActiveKey] = useState(DEFAULT_BOOKSHELF_KEY);
	const [bookshelfList, setBookshelfList] = useState<BookshelfItem[]>([]);

	const initDefaultBookshelf = () => {
		// @todo bookshelf GET api 연동
		const bookshelfList = localStorage.getItem(BOOKSHELF_LIST_KEY);

		if (!bookshelfList) {
			const newBookshelves = [DEFAULT_BOOKSHELF_ITEM];

			localStorage.setItem(BOOKSHELF_LIST_KEY, JSON.stringify(newBookshelves));
			setBookshelfList(newBookshelves);
		} else {
			setBookshelfList(JSON.parse(bookshelfList));
		}
	};

	useEffect(() => {
		initDefaultBookshelf();
	}, []);

	const createBookshelf = (name: string) => {
		console.log('[CREATE BOOKSHLEF]', name);
	};

	const addToBookshelf = (book: BookItem) => {
		return Promise.resolve();
	};
	const removeFromBookshelf = (key: string) => {
		return Promise.resolve();
	};

	return (
		<BookshelfContext
			value={{
				list: bookshelfList,
				activeKey,
				createBookshelf,
				addToBookshelf,
				removeFromBookshelf,
			}}
		>
			{children}
		</BookshelfContext>
	);
};

const useBookshelf = () => {
	const ctx = useContext(BookshelfContext);
	if (!ctx)
		throw new Error('useBookshlef must me used within Bookshelf Context');
	return ctx;
};

export { BookshelfProvider, useBookshelf };
