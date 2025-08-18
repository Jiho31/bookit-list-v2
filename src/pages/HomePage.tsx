import { useState } from 'react';
import { firebaseAuth } from '../plugins/fbase.ts';
import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth';

const OAUTH_PROVIDERS = {
	GOOGLE: 'google',
	GITHUB: 'github',
};

const SignupForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		} else if (name === 'confirmPassword') {
			setConfirmPassword(value);
		}
	};

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (email === '') {
			setError('Please enter an email');
			return;
		}

		if (password === '') {
			setError('Please enter a password');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match!');
			return;
		}

		try {
			await createUserWithEmailAndPassword(firebaseAuth, email, password);
		} catch (error: any) {
			setError(error.message);
		}
	};
	return (
		<>
			<form onSubmit={handleSignup}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					onChange={handleInputChange}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					onChange={handleInputChange}
				/>
				<input
					name="confirmPassword"
					type="password"
					placeholder="Confirm Password"
					onChange={handleInputChange}
				/>
				<button type="submit">Register</button>
			</form>
			{error && (
				<div className="bg-red-100 rounded-2xl p-3 text-red-700">{error}</div>
			)}
		</>
	);
};

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		}
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (email === '') {
			setError('Please enter an email');
			return;
		}

		if (password === '') {
			setError('Please enter a password');
			return;
		}

		try {
			await signInWithEmailAndPassword(firebaseAuth, email, password);
		} catch (error: any) {
			setError(error.message);
		}
	};

	const handleSocialLogin = async (provider: string) => {
		if (provider === OAUTH_PROVIDERS.GOOGLE) {
			await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
		} else if (provider === OAUTH_PROVIDERS.GITHUB) {
			await signInWithPopup(firebaseAuth, new GithubAuthProvider());
		}
	};
	return (
		<>
			<form onSubmit={handleLogin}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={email}
					onChange={handleInputChange}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={handleInputChange}
				/>
				<button type="submit">Login</button>
			</form>
			<button onClick={() => handleSocialLogin(OAUTH_PROVIDERS.GOOGLE)}>
				Sign In with Google
			</button>
			<button onClick={() => handleSocialLogin(OAUTH_PROVIDERS.GITHUB)}>
				Sign In with Github
			</button>
			{error && (
				<div className="bg-red-100 rounded-2xl p-3 text-red-700">{error}</div>
			)}
		</>
	);
};

export default function HomePage() {
	const [showSignup, setShowSignup] = useState(false);
	const [showLogin, setShowLogin] = useState(false);

	return (
		<>
			<div>display bookshelves and search bar</div>
			<div>
				{!showLogin && !showSignup && (
					<>
						<div>Login area</div>
						<button onClick={() => setShowLogin(!showLogin)}>Login</button>
						<button onClick={() => setShowSignup(!showSignup)}>Sign up</button>
					</>
				)}
			</div>
			{showSignup && <SignupForm />}
			{showLogin && <LoginForm />}
		</>
	);
}
