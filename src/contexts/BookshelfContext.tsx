import { createContext, use, useEffect, useState } from 'react';
import type { Book, BookItem, BookshelfItem } from '../types';
import { DEFAULT_BOOKSHELF_KEY } from '../consts/books';
import { useAuth } from './AuthContext';
import {
	setDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
	getDocs,
	query,
	where,
	deleteDoc,
	increment,
} from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';
import { toast } from 'sonner';

// Ensure a Firestore-safe document id from external book keys (no slashes)
const toSafeDocId = (raw: string) => Date.now() + raw.replaceAll('/', '_');

type BookshelfCtx = {
	activeKey: string;
	setActiveKey: (key: string) => void;
	list: BookshelfItem[];
	fetchBookshelf: (bookshelfKey: string) => Promise<BookshelfItem | null>;
	fetchBookshelfList: () => Promise<void>;
	createBookshelf: (name: string) => void;
	addBookToShelf: (bookshelfKey: string, book: Book) => Promise<void>;
	removeBookFromShelf: (bookshelfKey: string, bookKey: string) => Promise<void>;
	isLoading: boolean;
	updateBookshelf: (bookshelfKey: string, name: string) => Promise<void>;
	deleteBookshelf: (bookshelfKey: string) => Promise<void>;
	// error: Error | null;
};

const BookshelfContext = createContext<BookshelfCtx | undefined>(undefined);

const BookshelfProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeKey, setActiveKey] = useState(DEFAULT_BOOKSHELF_KEY);
	const [bookshelfList, setBookshelfList] = useState<BookshelfItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { userInfo, isAuthenticated } = useAuth();

	const generateBookshelfKey = () => `bookshelf_${Date.now()}`;

	const fetchBookshelfList = async () => {
		setIsLoading(true);
		try {
			if (!userInfo?.uid) {
				throw new Error('Invalid user ID');
			}
			// Fetch from the bookshelves subcollection
			const bookshelvesRef = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
			);
			const querySnapshot = await getDocs(bookshelvesRef);

			const bookshelves: BookshelfItem[] = [];
			querySnapshot.forEach((docSnap) => {
				const data = docSnap.data();
				bookshelves.push({
					key: data.key,
					name: data.name,
					books: [],
					numOfBooks: data.numOfBooks || 0,
					createdAt: data.createdAt,
					updatedAt: data.updatedAt,
				});
			});

			setBookshelfList(bookshelves);
		} catch (error) {
			console.error('Error fetching bookshelves:', error);
			setBookshelfList([]);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchBookshelf = async (bookshelfKey: string) => {
		if (!userInfo?.uid) {
			return null;
		}

		try {
			// bookshelf doc id equals bookshelfKey
			const booksCol = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				bookshelfKey,
				'books',
			);
			const booksSnap = await getDocs(booksCol);
			const books: BookItem[] = [];
			booksSnap.forEach((b) => {
				const data = b.data() as BookItem;
				books.push({ ...data });
			});

			// read shelf meta
			const shelfQuery = query(
				collection(firebaseDB, 'users', userInfo.uid, 'bookshelves'),
				where('key', '==', bookshelfKey),
			);
			const shelfQuerySnap = await getDocs(shelfQuery);
			if (shelfQuerySnap.empty) return null;
			const shelfData = shelfQuerySnap.docs[0].data();

			return {
				key: shelfData.key,
				name: shelfData.name,
				books,
				numOfBooks: shelfData.numOfBooks || books.length,
				createdAt: shelfData.createdAt,
				updatedAt: shelfData.updatedAt,
			};
		} catch (error) {
			console.error('Error fetching bookshelf:', error);
			return null;
		}
	};

	useEffect(() => {
		if (isAuthenticated && userInfo?.uid) {
			setActiveKey(DEFAULT_BOOKSHELF_KEY);
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
			const newKey = generateBookshelfKey();
			const shelfRef = doc(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				newKey,
			);

			const newBookshelfData = {
				key: newKey,
				name,
				books: [],
				numOfBooks: 0,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			};

			await setDoc(shelfRef, newBookshelfData);
			await fetchBookshelfList();
		} catch (error) {
			console.error('Error creating bookshelf:', error);
		}
	};

	const getBookItemFormat = (id: string, book: Book): BookItem => ({
		id,
		book,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	});

	const updateBookshelf = async (bookshelfKey: string, name: string) => {
		try {
			if (!userInfo?.uid) throw new Error('User not authenticated');
			const shelfRef = doc(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				bookshelfKey,
			);
			await updateDoc(shelfRef, { name, updatedAt: serverTimestamp() });
			await fetchBookshelfList();
			toast.success('Bookshelf updated');
		} catch (err) {
			console.error(err);
		}
	};

	const deleteBookshelf = async (bookshelfKey: string) => {
		try {
			if (!userInfo?.uid) throw new Error('User not authenticated');
			await deleteDoc(
				doc(firebaseDB, 'users', userInfo.uid, 'bookshelves', bookshelfKey),
			);
			await fetchBookshelfList();
			toast.success('Bookshelf deleted');
		} catch (err) {
			console.error(err);
			toast.error('Failed to delete bookshelf');
		}
	};

	const removeBookFromShelf = async (bookshelfKey: string, bookKey: string) => {
		if (!userInfo?.uid) {
			toast('Invalid user object');
			return;
		}

		try {
			const bookRef = doc(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				bookshelfKey,
				'books',
				// toSafeDocId(bookKey),
				bookKey,
			);
			await deleteDoc(bookRef);

			const shelfRef = doc(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				bookshelfKey,
			);
			await updateDoc(shelfRef, {
				numOfBooks: increment(-1),
				updatedAt: serverTimestamp(),
			});
			toast.success('Book removed');
			await fetchBookshelfList();
		} catch (err) {
			console.error(err);
			toast.error('Failed to remove book');
		}
	};

	const addBookToShelf = async (bookshelfKey: string, book: Book) => {
		if (!userInfo?.uid) {
			throw new Error('User not authenticated');
		}

		try {
			const targetShelfKey = bookshelfKey || DEFAULT_BOOKSHELF_KEY;
			const booksColRef = collection(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				targetShelfKey,
				'books',
			);
			const safeId = toSafeDocId(book.key || 'UNKNOWN_KEY');
			await setDoc(doc(booksColRef, safeId), getBookItemFormat(safeId, book));

			const shelfRef = doc(
				firebaseDB,
				'users',
				userInfo.uid,
				'bookshelves',
				targetShelfKey,
			);
			await updateDoc(shelfRef, {
				numOfBooks: increment(1),
				updatedAt: serverTimestamp(),
			});

			toast.success('Successfully added to bookshelf');
			await fetchBookshelfList();
		} catch (err) {
			toast.error(`Error: ${err as string}`);
		}
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
				updateBookshelf,
				deleteBookshelf,
				addBookToShelf,
				removeBookFromShelf,
				isLoading,
			}}
		>
			{children}
		</BookshelfContext>
	);
};

const useBookshelf = () => {
	const ctx = use(BookshelfContext);
	if (!ctx)
		throw new Error('useBookshlef must me used within Bookshelf Context');
	return ctx;
};

export { BookshelfProvider, useBookshelf };
