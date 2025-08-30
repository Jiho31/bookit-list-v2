import { createContext, useContext } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import type { User } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';

type AuthCtx = {
	userInfo: User | undefined;
	isAuthenticated: boolean;
	handleRegister: (userCredential: any) => void;
	// login: (data: any) => Promise<void>;
	handleLogout: () => void;
	initUserBookshelf: () => void;
};
const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { userInfo, isAuthenticated, logout } = useFirebaseAuth();

	// bookshelf context 에서 구현하기?
	const initUserBookshelf = () => {
		// @todo create default bookshelf
		// ---> check if there's data saved in local(or session) storage
		console.log('init bookshelf########');
	};

	// handleNewUser
	const handleRegister = async ({ uid }: { uid: string }) => {
		const newUserObject = {
			bookshelves: {},
		};

		try {
			await setDoc(doc(firebaseDB, 'users', uid), newUserObject);
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
				initUserBookshelf,
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
