import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../plugins/fbase';
import { useEffect, useState } from 'react';
import type { User } from '../types';

export default function useFirebaseAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userInfo, setUserInfo] = useState<User>();

	const parseUserData = (user: any) => ({
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		profileImage: user.photoURL,
	});

	const handleAuthStateChange = () => {
		onAuthStateChanged(firebaseAuth, (user) => {
			if (user) {
				setIsAuthenticated(true);
				setUserInfo(parseUserData(user));
			} else {
				setIsAuthenticated(false);
				setUserInfo(undefined);
			}
		});
	};

	useEffect(() => {
		if (!isAuthenticated) {
			// @todo redirect 처리
			console.log('Redirect to main page');
		}
	}, [isAuthenticated]);

	const getCurrentUser = () => firebaseAuth.currentUser;
	const logout = () => firebaseAuth.signOut();

	useEffect(() => {
		handleAuthStateChange();
	}, []);

	return {
		getCurrentUser,
		isAuthenticated,
		userInfo,
		logout,
	};
}
