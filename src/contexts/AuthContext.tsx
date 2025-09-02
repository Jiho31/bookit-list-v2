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

	// const createDefaultBookshelf = async (uid: string) => {
	// 	const shelvesRef = collection(firebaseDB, 'users', uid, 'bookshelves');
	// 	await addDoc(shelvesRef, {
	// 		name: 'To Read 📚',
	// 		createdAt: serverTimestamp(),
	// 		updatedAt: serverTimestamp(),
	// 		numOfBooks: 0,
	// 	});

	// 	console.log('######2222 createDefaultBookshelf');
	// };

	// handleNewUser
	const handleRegister = async ({ uid }: { uid: string }) => {
		const newUserData = {
			bookshelves: {
				[DEFAULT_BOOKSHELF_KEY]: {
					...DEFAULT_BOOKSHELF_ITEM,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				},
			},
			lastUpdatedAt: serverTimestamp(),
		};

		// const newUserData = {
		// 	bookshelves: {},
		// };

		try {
			// 	const shelvesRef = collection(firebaseDB, 'users', uid, 'bookshelves');

			await setDoc(doc(firebaseDB, 'users', uid), newUserData);
			// await createDefaultBookshelf(uid);
		} catch (e) {
			console.error('Error in new user registration: ', e);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
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
