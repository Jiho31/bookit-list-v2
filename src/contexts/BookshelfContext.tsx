import {
	createContext,
	use,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from 'react';
import type { Timestamp } from 'firebase/firestore';
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

	const isTimestamp = (v: unknown): v is Timestamp =>
		typeof v === 'object' &&
		v !== null &&
		'toDate' in (v as Record<string, unknown>);

	const generateBookshelfKey = () => `bookshelf_${Date.now()}`;

	const fetchBookshelfList = useCallback(async () => {
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
				const data = docSnap.data() as Record<string, unknown>;
				const item: BookshelfItem = {
					key: typeof data.key === 'string' ? data.key : '',
					name: typeof data.name === 'string' ? data.name : '',
					books: [],
					numOfBooks: typeof data.numOfBooks === 'number' ? data.numOfBooks : 0,
					createdAt: isTimestamp(data.createdAt) ? data.createdAt : null,
					updatedAt: isTimestamp(data.updatedAt) ? data.updatedAt : null,
				};
				bookshelves.push(item);
			});

			setBookshelfList(bookshelves);
		} catch (error) {
			console.error('Error fetching bookshelves:', error);
			setBookshelfList([]);
		} finally {
			setIsLoading(false);
		}
	}, [userInfo?.uid]);

	const fetchBookshelf = useCallback(
		async (bookshelfKey: string) => {
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
				const shelfData = shelfQuerySnap.docs[0].data() as Record<
					string,
					unknown
				>;

				return {
					key: typeof shelfData.key === 'string' ? shelfData.key : '',
					name: typeof shelfData.name === 'string' ? shelfData.name : '',
					books,
					numOfBooks:
						typeof shelfData.numOfBooks === 'number'
							? shelfData.numOfBooks
							: books.length,
					createdAt: isTimestamp(shelfData.createdAt)
						? shelfData.createdAt
						: null,
					updatedAt: isTimestamp(shelfData.updatedAt)
						? shelfData.updatedAt
						: null,
				};
			} catch (error) {
				console.error('Error fetching bookshelf:', error);
				return null;
			}
		},
		[userInfo?.uid],
	);

	useEffect(() => {
		if (isAuthenticated && userInfo?.uid) {
			setActiveKey(DEFAULT_BOOKSHELF_KEY);
			const timer = setTimeout(() => {
				void fetchBookshelfList();
			}, 1500);

			return () => clearTimeout(timer);
		}
	}, [isAuthenticated, userInfo?.uid, fetchBookshelfList]);

	const createBookshelf = useCallback(
		async (name: string) => {
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
		},
		[userInfo?.uid, fetchBookshelfList],
	);

	const getBookItemFormat = (id: string, book: Book): BookItem => ({
		id,
		book,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	});

	const updateBookshelf = useCallback(
		async (bookshelfKey: string, name: string) => {
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
		},
		[userInfo?.uid, fetchBookshelfList],
	);

	const deleteBookshelf = useCallback(
		async (bookshelfKey: string) => {
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
		},
		[userInfo?.uid, fetchBookshelfList],
	);

	const removeBookFromShelf = useCallback(
		async (bookshelfKey: string, bookKey: string) => {
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
		},
		[userInfo?.uid, fetchBookshelfList],
	);

	const addBookToShelf = useCallback(
		async (bookshelfKey: string, book: Book) => {
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
		},
		[userInfo?.uid, fetchBookshelfList],
	);

	const contextValue = useMemo(
		() => ({
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
		}),
		[
			bookshelfList,
			activeKey,
			fetchBookshelf,
			fetchBookshelfList,
			createBookshelf,
			updateBookshelf,
			deleteBookshelf,
			addBookToShelf,
			removeBookFromShelf,
			isLoading,
		],
	);

	return <BookshelfContext value={contextValue}>{children}</BookshelfContext>;
};

const useBookshelf = () => {
	const ctx = use(BookshelfContext);
	if (!ctx)
		throw new Error('useBookshlef must me used within Bookshelf Context');
	return ctx;
};

export { BookshelfProvider, useBookshelf };
