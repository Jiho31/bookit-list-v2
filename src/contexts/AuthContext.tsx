import { createContext, useContext } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import type { User } from '../types';
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';
import { DEFAULT_BOOKSHELF_ITEM, DEFAULT_BOOKSHELF_KEY } from '../consts/books';

type AuthCtx = {
	userInfo: User | undefined;
	isAuthenticated: boolean;
	handleRegister: (userCredential: any) => void;
	// login: (data: any) => Promise<void>;
	handleLogout: () => void;
};
const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { userInfo, isAuthenticated, logout } = useFirebaseAuth();

	const createDefaultBookshelf = async (uid: string) => {
		const shelvesRef = collection(firebaseDB, 'users', uid, 'bookshelves');
		await addDoc(shelvesRef, {
			key: DEFAULT_BOOKSHELF_KEY,
			name: DEFAULT_BOOKSHELF_ITEM.name,
			books: [],
			numOfBooks: 0,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});

		console.log('Default bookshelf created successfully');
	};

	// handleNewUser
	const handleRegister = async ({ uid }: { uid: string }) => {
		const newUserData = {
			lastUpdatedAt: serverTimestamp(),
		};

		try {
			// Create the user document
			await setDoc(doc(firebaseDB, 'users', uid), newUserData);

			// Create the default bookshelf as a subcollection
			await createDefaultBookshelf(uid);
		} catch (e) {
			console.error('Error in new user registration: ', e);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			// @todo reload page or navigate to main page ?
			location.reload();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<AuthContext
			value={{
				userInfo,
				isAuthenticated,
				handleRegister,
				handleLogout,
			}}
		>
			{children}
		</AuthContext>
	);
};

const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};

export { AuthContext, AuthProvider, useAuth };
