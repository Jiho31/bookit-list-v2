import { useEffect, useState } from 'react';
import { firebaseAuth } from '../plugins/fbase.ts';
import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext.tsx';

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
		<section className="flex gap-10 p-10 bg-amber-50 rounded-3xl">
			{/* logo!! other info letters */}
			<h2 className="text-md font-semibold mb-3">
				Register with your email address
			</h2>
			<form className="flex flex-col gap-3" onSubmit={handleSignup}>
				<div className="flex gap-3">
					<label className="text-sm font-medium text-gray-800" htmlFor="email">
						EMAIL
					</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="Email"
						autoComplete="false"
						onChange={handleInputChange}
					/>
				</div>
				<div className="flex gap-3">
					<label
						className="text-sm font-medium text-gray-800"
						htmlFor="password"
					>
						PASSWORD
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="false"
						placeholder="Password"
						onChange={handleInputChange}
					/>
				</div>
				<div className="flex gap-3">
					<label
						className="text-sm font-medium text-gray-800"
						htmlFor="confirmPassword"
					>
						CONFIRM PASSWORD
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						onChange={handleInputChange}
					/>
				</div>
				{error && (
					<div className="bg-red-100 rounded-md px-5 py-2 text-red-700 font-semibold text-sm">
						⚠️ {error.toUpperCase()}
					</div>
				)}

				<button type="submit">Register</button>
			</form>
		</section>
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

function UserAuthForm() {
	const [display, setDisplay] = useState<'DEFAULT' | 'LOGIN' | 'SIGNUP'>(
		'DEFAULT',
	);

	const displayContent = () => {
		switch (display) {
			case 'LOGIN':
				return <LoginForm />;
			case 'SIGNUP':
				return <SignupForm />;
		}
	};

	return (
		<div>
			{display === 'DEFAULT' ? (
				<div className="flex gap-3">
					<button
						className="text-amber-50 rounded-2xl px-4 py-3 bg-amber-500"
						onClick={() => setDisplay('LOGIN')}
					>
						Login
					</button>
					<button
						className="text-amber-50 rounded-2xl px-4 py-3 bg-amber-500"
						onClick={() => setDisplay('SIGNUP')}
					>
						Sign up
					</button>
				</div>
			) : (
				displayContent()
			)}
		</div>
	);
}

// AuthPage / LoginPage
export default function HomePage() {
	const { isAuthenticated, userInfo } = useAuth();

	return (
		<>
			{isAuthenticated ? (
				<section>
					<div>display personal bookshelves</div>
					<div>
						Email: {userInfo?.email}
						Name: {userInfo?.displayName}
					</div>
				</section>
			) : (
				<UserAuthForm />
			)}
		</>
	);
}
