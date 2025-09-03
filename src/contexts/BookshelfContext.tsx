import { createContext, useContext, useEffect, useState } from 'react';
import type { BookItem, BookshelfItem } from '../types';
import { DEFAULT_BOOKSHELF_KEY } from '../consts/books';
import { useAuth } from './AuthContext';
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';

type BookshelfCtx = {
	activeKey: string;
	setActiveKey: (key: string) => void;
	list: BookshelfItem[];
	fetchBookshelf: (bookshelfKey: string) => Promise<BookshelfItem | null>;
	fetchBookshelfList: () => Promise<void>;
	createBookshelf: (name: string) => void;
	addBookToShelf: (bookshelfKey: string, book: BookItem) => Promise<void>;
	removeFromBookshelf: (bookshelfKey: string, bookKey: string) => Promise<void>;
	isLoading: boolean;
	// deleteBookshelf: (key: string) => Promise<void>;
	// error: Error | null;
};

const BookshelfContext = createContext<BookshelfCtx | undefined>(undefined);

const BookshelfProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeKey, setActiveKey] = useState(DEFAULT_BOOKSHELF_KEY);
	const [bookshelfList, setBookshelfList] = useState<BookshelfItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { userInfo, isAuthenticated } = useAuth();

	const fetchBookshelfList = async () => {
		if (!userInfo?.uid) {
			throw new Error('Invalid user ID');
		}

		setIsLoading(true);
		try {
			// Fetch from the bookshelves subcollection
			const bookshelvesRef = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
			);
			const querySnapshot = await getDocs(bookshelvesRef);

			const bookshelves: BookshelfItem[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				bookshelves.push({
					key: data.key,
					name: data.name,
					books: data.books || [],
					numOfBooks: data.numOfBooks || 0,
					createdAt: data.createdAt,
					updatedAt: data.updatedAt,
				});
			});

			// console.log('Fetched bookshelves from subcollection:', bookshelves);
			setBookshelfList(bookshelves);
		} catch (error) {
			console.error('Error fetching bookshelves:', error);
			// Set empty list on error
			setBookshelfList([]);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchBookshelf = async (bookshelfKey: string) => {
		if (!userInfo?.uid) {
			console.log('Invalid userInfo');
			return {};
		}

		try {
			// Query the bookshelves subcollection to find the specific bookshelf by key
			const bookshelvesRef = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
			);
			const q = query(bookshelvesRef, where('key', '==', bookshelfKey));
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const doc = querySnapshot.docs[0];
				const data = doc.data();
				// console.log('Found bookshelf:', data);
				return {
					key: data.key,
					name: data.name,
					books: data.books || [],
					numOfBooks: data.numOfBooks || 0,
					createdAt: data.createdAt,
					updatedAt: data.updatedAt,
				};
			} else {
				console.log('Bookshelf not found with key:', bookshelfKey);
				return null;
			}
		} catch (error) {
			console.error('Error fetching bookshelf:', error);
			return null;
		}
	};

	useEffect(() => {
		if (isAuthenticated && userInfo?.uid) {
			setActiveKey(DEFAULT_BOOKSHELF_KEY);
			// Fetch bookshelves with a small delay to ensure database operations complete
			const timer = setTimeout(() => {
				fetchBookshelfList();
			}, 1500);

			return () => clearTimeout(timer);
		}
	}, [isAuthenticated, userInfo?.uid]);

	const createBookshelf = async (name: string) => {
		if (!userInfo?.uid) {
			console.error('No user authenticated');
			return;
		}

		try {
			const bookshelvesRef = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
			);
			const newBookshelfData = {
				key: `bookshelf_${Date.now()}`, // Generate a unique key
				name,
				books: [],
				numOfBooks: 0,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			};

			await addDoc(bookshelvesRef, newBookshelfData);
			console.log('[CREATE BOOKSHELF]', name, 'successfully created');

			// Refresh the bookshelf list
			await fetchBookshelfList();
		} catch (error) {
			console.error('Error creating bookshelf:', error);
		}
	};

	const addBookToShelf = async (bookshelfKey: string, book: BookItem) => {
		if (!userInfo?.uid) {
			throw new Error('User not authenticated');
		}

		try {
			// First, find the bookshelf document by its key
			const bookshelvesRef = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
			);
			const q = query(bookshelvesRef, where('key', '==', bookshelfKey));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				throw new Error('Bookshelf not found');
			}

			const bookshelfDoc = querySnapshot.docs[0];
			const bookshelfRef = doc(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				bookshelfDoc.id,
			);

			// Get current books array and add the new book
			const currentData = bookshelfDoc.data();
			const updatedBooks = [...(currentData.books || []), book];

			// Update the bookshelf document
			await updateDoc(bookshelfRef, {
				books: updatedBooks,
				numOfBooks: updatedBooks.length,
				updatedAt: serverTimestamp(),
			});

			// Refresh the bookshelf list
			await fetchBookshelfList();
		} catch (err) {
			console.error('Error adding book to bookshelf:', err);
			throw err;
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
				fetchBookshelfList,
				createBookshelf,
				addBookToShelf,
				removeFromBookshelf,
				isLoading,
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
