import { createContext, useContext } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import type { User } from '../types';

type AuthCtx = {
	userInfo: User | undefined;
	isAuthenticated: boolean;
	login: () => Promise<void>;
	logout: () => void;
};
const AuthContext = createContext<AuthCtx | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { userInfo, isAuthenticated, logout } = useFirebaseAuth();

	const login = () => {
		return Promise.resolve();
	};

	return (
		<AuthContext value={{ userInfo, isAuthenticated, login, logout }}>
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
