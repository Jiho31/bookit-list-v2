import { createContext, useContext } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import type { User } from '../types';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';
import { createBookshelfForUser } from '../services/bookshelf';
import { DEFAULT_BOOKSHELF_KEY, DEFAULT_BOOKSHELF_ITEM } from '../consts/books';

type AuthCtx = {
	userInfo: User | undefined;
	isAuthenticated: boolean;
	handleRegister: (userCredential: any) => void;
	handleLogout: () => void;
};
const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { userInfo, isAuthenticated, logout } = useFirebaseAuth();

	const handleRegister = async ({ uid }: { uid: string }) => {
		const newUserData = {
			lastUpdatedAt: serverTimestamp(),
		};

		try {
			if (!uid) {
				throw new Error('user credential is invalid');
			}
			await setDoc(doc(firebaseDB, 'users', uid), newUserData);
			await createBookshelfForUser({
				uid,
				key: DEFAULT_BOOKSHELF_KEY,
				name: DEFAULT_BOOKSHELF_ITEM.name,
			});
		} catch (e) {
			console.error('Error in new user registration: ', e);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
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
