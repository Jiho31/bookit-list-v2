import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.tsx';
import useFirebaseAuth from '../hooks/useFirebaseAuth.tsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.tsx';

const SignupForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');

	const { handleRegister, requestSocialLogin } = useAuth();
	const { createUserWithEmail, OAUTH_PROVIDERS } = useFirebaseAuth();

	useEffect(() => {
		if (error !== '') {
			toast.warning(error);
		}
	}, [error]);

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
			const userCredential = await createUserWithEmail(email, password);

			await handleRegister(userCredential);
			toast.success('Successfully registered new user.');
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSignup}>
			<div className="flex gap-3">
				<label
					className="content-center basis-1/3 text-sm text-slate-600"
					htmlFor="email"
				>
					Email
				</label>
				<input
					className="py-2 px-4 rounded-lg basis-2/3 text-sm bg-white border border-slate-200"
					id="email"
					name="email"
					type="email"
					placeholder="Email"
					onChange={handleInputChange}
				/>
			</div>
			<div className="flex gap-3">
				<label
					className="content-center basis-1/3 text-sm text-slate-600"
					htmlFor="password"
				>
					Password
				</label>
				<input
					className="py-2 px-4 rounded-lg basis-2/3 text-sm bg-white border border-slate-200"
					id="password"
					name="password"
					type="password"
					placeholder="Password"
					onChange={handleInputChange}
				/>
			</div>
			<div className="flex gap-3">
				<label
					className="content-center basis-1/3 text-sm text-slate-600"
					htmlFor="confirmPassword"
				>
					Confirm Password
				</label>
				<input
					className="py-2 px-4 rounded-lg basis-2/3 text-sm bg-white border border-slate-200"
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					placeholder="Confirm Password"
					onChange={handleInputChange}
				/>
			</div>
			<button
				className="text-indigo-50 mt-3 bg-indigo-600 hover:bg-indigo-800 px-2 py-2.5 text-sm rounded-xl"
				type="submit"
			>
				Register
			</button>
			<div className="w-full flex items-center gap-2 text-sm text-slate-600">
				<span className="h-[1px] bg-slate-300 w-full"></span>
				or
				<span className="h-[1px] bg-slate-300 w-full"></span>
			</div>
			<button
				className="inline-flex justify-center gap-3 px-4 py-2 bg-slate-100 text-sm text-slate-600 border border-slate-200 hover:bg-slate-200"
				type="button"
				onClick={() => requestSocialLogin(OAUTH_PROVIDERS.GOOGLE)}
			>
				<svg
					className="w-4"
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Google</title>
					<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
				</svg>
				Sign up with Google
			</button>
			<button
				className="inline-flex justify-center gap-3 px-4 py-2 bg-slate-100 text-sm text-slate-600 border border-slate-200 hover:bg-slate-200"
				type="button"
				onClick={() => requestSocialLogin(OAUTH_PROVIDERS.GITHUB)}
			>
				<svg
					className="w-4"
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>GitHub</title>
					<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
				</svg>
				Sign up with Github
			</button>
		</form>
	);
};

const LoginForm = () => {
	const { handleEmailLogin, OAUTH_PROVIDERS } = useFirebaseAuth();
	const { requestSocialLogin } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (error !== '') {
			toast.warning(error);
		}
	}, [error]);

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
			await handleEmailLogin(email, password);
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<form className="flex flex-col gap-3" onSubmit={handleLogin}>
			<label htmlFor="email" className="text-xs text-slate-600 mb-[-5px]">
				Email
			</label>
			<input
				className="py-2 px-4 rounded-lg border border-slate-200 text-sm"
				id="email"
				name="email"
				type="email"
				placeholder="Email"
				value={email}
				onChange={handleInputChange}
			/>
			<label htmlFor="password" className="text-xs text-slate-600 mb-[-5px]">
				Password
			</label>
			<input
				className="py-2 px-4 rounded-lg border border-slate-200 text-sm"
				id="password"
				name="password"
				type="password"
				placeholder="Password"
				value={password}
				onChange={handleInputChange}
			/>
			<button
				className="px-4 py-2.5 text-sm text-indigo-50 bg-indigo-600 hover:bg-indigo-800"
				type="submit"
			>
				Sign in
			</button>
			<div className="w-full flex items-center gap-2 text-sm text-slate-600">
				<span className="h-[1px] bg-slate-300 w-full"></span>
				or
				<span className="h-[1px] bg-slate-300 w-full"></span>
			</div>
			<button
				className="inline-flex justify-center gap-3 px-4 py-2 bg-slate-100 text-sm text-slate-600 border border-slate-200 hover:bg-slate-200"
				type="button"
				onClick={() => requestSocialLogin(OAUTH_PROVIDERS.GOOGLE)}
			>
				<svg
					className="w-4"
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Google</title>
					<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
				</svg>
				Sign in with Google
			</button>
			<button
				className="inline-flex justify-center gap-3 px-4 py-2 bg-slate-100 text-sm text-slate-600 border border-slate-200 hover:bg-slate-200"
				type="button"
				onClick={() => requestSocialLogin(OAUTH_PROVIDERS.GITHUB)}
			>
				<svg
					className="w-4"
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>GitHub</title>
					<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
				</svg>
				Sign in with Github
			</button>
		</form>
	);
};

function UserAuthForm() {
	const [display, setDisplay] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

	const toggleDisplay = () => {
		setDisplay((prev) => (prev == 'LOGIN' ? 'SIGNUP' : 'LOGIN'));
	};

	return (
		<section className="flex flex-col md:flex-row h-full md:h-[450px] min-h-fit w-full md:w-[700px] max-w-90vw gap-10 p-4 sm:p-10 md:m-10 bg-white border border-slate-200 md:rounded-3xl">
			<div className="w-full md:w-1/2 flex flex-col gap-3 items-center text-center">
				<img
					className="w-36 md:w-50 h-auto self-center"
					src="/logo.png"
					alt="Bookit List logo"
				/>
				<h2 className="text-xl font-semibold mb-3">Welcome to Bookit List!</h2>
				<p>Get started to create and manage your personal bookshelves!</p>
			</div>
			<div className="w-full md:w-1/2 flex flex-col gap-3 justify-center">
				<>{display == 'LOGIN' ? <LoginForm /> : <SignupForm />}</>
				<div className="text-sm self-center">
					{display == 'LOGIN' ? (
						<>
							New to Bookit List?
							<button
								type="button"
								onClick={toggleDisplay}
								className="ml-1 bg-inherit p-0 text-indigo-700 hover:underline"
							>
								Create an account
							</button>
						</>
					) : (
						<>
							Already have an account?
							<button
								type="button"
								onClick={toggleDisplay}
								className="ml-1 bg-inherit p-0 text-indigo-700 hover:underline"
							>
								Sign in
							</button>
						</>
					)}
				</div>
			</div>
		</section>
	);
}

export default function AuthPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			navigate('/library', { replace: true });
		}
	}, [isAuthenticated, isLoading, navigate]);

	if (isLoading || isAuthenticated) {
		return (
			<section
				id="container"
				className="w-full flex justify-center items-center"
			>
				<LoadingSpinner />
			</section>
		);
	}

	return (
		<section
			id="container"
			className="w-full h-auto flex justify-center items-center"
		>
			<UserAuthForm />
		</section>
	);
}
