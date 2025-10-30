import { createContext, use } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import type { User } from '../types';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';
import { createBookshelfForUser } from '../services/bookshelf';
import { DEFAULT_BOOKSHELF_KEY, DEFAULT_BOOKSHELF_ITEM } from '../consts/books';
import type { UserCredential } from 'firebase/auth';

type AuthCtx = {
	userInfo: User | undefined;
	isAuthenticated: boolean;
	isLoading: boolean;
	handleRegister: (userCredential: UserCredential) => Promise<void>;
	handleLogout: () => void;
	requestSocialLogin: (provider: string) => Promise<void>;
};
const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { userInfo, isAuthenticated, isLoading, logout, handleSocialLogin } =
		useFirebaseAuth();

	const handleRegister = async ({ user }: UserCredential) => {
		const newUserData = {
			lastUpdatedAt: serverTimestamp(),
		};

		try {
			if (!user.uid) {
				throw new Error('user credential is invalid');
			}
			await setDoc(doc(firebaseDB, 'users', user.uid), newUserData);
			await createBookshelfForUser({
				uid: user.uid,
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

	const requestSocialLogin = async (provider: string) => {
		try {
			const response = await handleSocialLogin(provider);

			if (
				response &&
				response.userCredential &&
				response.additionalInfo?.isNewUser
			) {
				await handleRegister(response.userCredential);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<AuthContext
			value={{
				userInfo,
				isAuthenticated,
				isLoading,
				handleRegister,
				handleLogout,
				requestSocialLogin,
			}}
		>
			{children}
		</AuthContext>
	);
};

const useAuth = () => {
	const ctx = use(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};

export { AuthContext, AuthProvider, useAuth };
