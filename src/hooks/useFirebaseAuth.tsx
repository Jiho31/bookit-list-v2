import {
	createUserWithEmailAndPassword,
	getAdditionalUserInfo,
	GithubAuthProvider,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth';
import { firebaseAuth } from '../plugins/fbase';
import { useEffect, useState } from 'react';
import type { User } from '../types';

const OAUTH_PROVIDERS = {
	GOOGLE: 'google',
	GITHUB: 'github',
};

const PROVIDER_INSTANCES = {
	[OAUTH_PROVIDERS.GOOGLE]: new GoogleAuthProvider(),
	[OAUTH_PROVIDERS.GITHUB]: new GithubAuthProvider(),
};

export default function useFirebaseAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userInfo, setUserInfo] = useState<User>();

	const parseUserData = (user: any) => ({
		uid: user.uid,
		email: user.email,
		displayName: user.displayName, // @todo handle empty cases
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

	const createUserWithEmail = (email: string, password: string) =>
		createUserWithEmailAndPassword(firebaseAuth, email, password);

	const handleEmailLogin = (email: string, password: string) =>
		signInWithEmailAndPassword(firebaseAuth, email, password);

	const handleSocialLogin = async (provider: string) => {
		try {
			const userCredential = await signInWithPopup(
				firebaseAuth,
				PROVIDER_INSTANCES[provider],
			);
			const additionalInfo = getAdditionalUserInfo(userCredential);

			return {
				userCredential,
				additionalInfo,
			};
		} catch (err) {
			console.error(err);
		}
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
		createUserWithEmail,
		handleEmailLogin,
		handleSocialLogin,
		OAUTH_PROVIDERS,
	};
}
