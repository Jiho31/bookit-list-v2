import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { BookItem, BookshelfItem } from '../types';
import {
	BOOKSHELF_LIST_KEY,
	DEFAULT_BOOKSHELF_ITEM,
	DEFAULT_BOOKSHELF_KEY,
} from '../consts/books';
import { useAuth } from './AuthContext';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';

type BookshelfCtx = {
	activeKey: string;
	setActiveKey: (key: string) => void;
	list: BookshelfItem[];
	fetchBookshelf: (bookshelfKey: string) => Promise<BookshelfItem[]>;
	createBookshelf: (name: string) => void;
	addBookToShelf: (bookshelfKey: string, book: BookItem) => Promise<void>;
	removeFromBookshelf: (bookshelfKey: string, bookKey: string) => Promise<void>;
	// deleteBookshelf: (key: string) => Promise<void>;
	// isLoading: boolean;
	// error: Error | null;
};

const BookshelfContext = createContext<BookshelfCtx | undefined>(undefined);

const BookshelfProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeKey, setActiveKey] = useState(DEFAULT_BOOKSHELF_KEY);
	const [bookshelfList, setBookshelfList] = useState<BookshelfItem[]>([]);
	const { userInfo, isAuthenticated } = useAuth();

	// const userBookshelfRef = useMemo(
	// 	() => (userInfo ? doc(firebaseDB, 'users', userInfo?.uid) : null),
	// 	[firebaseDB, userInfo],
	// );

	const fetchBookshelfList = async () => {
		if (!userInfo?.uid) {
			throw new Error('Invalid user ID');
		}

		const userBookshelfRef = doc(firebaseDB, 'users', userInfo?.uid);
		if (!userBookshelfRef) {
			throw new Error('No valid bookshelf referenced');
		}

		const docSnap = await getDoc(userBookshelfRef);
		if (docSnap.exists()) {
			const bb = docSnap.data().bookshelves;
			console.log(bb, '<<<<<<<<<< FETCHED BOOKSHELF LIST');
			setBookshelfList(bb);
		} else {
			// docSnap.data() will be undefined in this case
			throw new Error('Bookshelf cannot be referenced!');
		}
	};

	const fetchBookshelf = async (key: string) => {
		if (!userInfo) {
			console.log('invalide userInfo');

			return [];
		}

		const shelfRef = doc(firebaseDB, 'users', userInfo.uid, 'bookshelves');
		const shelfSnap = await getDoc(shelfRef);
		console.log(shelfSnap, '#####9999');

		if (shelfSnap.exists()) {
			console.log(shelfSnap.data(), '####2222222222');
			console.log(shelfSnap.get(key), '@@@@@@ ');

			return [];
		} else {
			console.log(shelfSnap, '<<<<<<<<<<<< ERROR!1111111111');
			return [];
		}
	};

	// in local storage
	// const initDefaultBookshelf = async () => {
	// 	const bookshelfList = localStorage.getItem(BOOKSHELF_LIST_KEY);

	// 	if (!bookshelfList) {
	// 		const newBookshelves = [DEFAULT_BOOKSHELF_ITEM];

	// 		localStorage.setItem(BOOKSHELF_LIST_KEY, JSON.stringify(newBookshelves));
	// 		setBookshelfList(newBookshelves);
	// 	} else {
	// 		setBookshelfList(JSON.parse(bookshelfList));
	// 	}
	// };

	useEffect(() => {
		if (isAuthenticated) {
			setActiveKey(DEFAULT_BOOKSHELF_KEY);
			fetchBookshelfList();
		}
	}, [isAuthenticated]);

	const createBookshelf = (name: string) => {
		console.log('[CREATE BOOKSHLEF]', name);
	};

	const addBookToShelf = async (bookshelfKey: string, book: BookItem) => {
		if (!userInfo) {
			throw new Error('invalid');
		}

		try {
			const bookshelfRef = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				bookshelfKey,
				'books',
			);

			// const docRef = await addDoc(bookshelfRef, {
			// 	// bookKey,
			// 	books: [book],
			// 	createdAt: serverTimestamp(),
			// 	memos: [],
			// });

			// console.log(docRef);
		} catch (err) {
			console.error(err);
		}
	};

	const removeFromBookshelf = (bookshelfKey: string, bookKey: string) => {
		return Promise.resolve();
	};

	return (
		<BookshelfContext
			value={{
				list: bookshelfList,
				activeKey,
				setActiveKey,
				fetchBookshelf,
				createBookshelf,
				addBookToShelf,
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
