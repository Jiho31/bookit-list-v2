import { Link, Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Toaster } from 'sonner';
import ModalRoot from './ModalRoot';

export default function Layout() {
	const { isAuthenticated, handleLogout, userInfo } = useAuth();
	const navigate = useNavigate();

	const handleClick = () => {
		if (isAuthenticated) {
			handleLogout();
		} else {
			navigate('/auth');
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/home');
		} else {
			navigate('/');
		}
	}, [isAuthenticated]);

	return (
		<div id="app-container" className="w-screen h-auto flex flex-col">
			<header className="w-screen min-h-15 text-sm bg-slate-50 border-b border-b-slate-200 px-20 flex justify-between">
				<nav className="flex gap-10 items-center text-slate-900">
					<Link to="/">
						<img className="w-18 h-auto" src="/logo.png" alt="logo" />
					</Link>
					<Link
						to="/"
						className="inline-flex gap-2 items-end group hover:text-indigo-600"
					>
						<svg
							className="fill-current"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<title>Home</title>
							<path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
						</svg>
						Home
					</Link>
					<Link
						to="/home"
						className="inline-flex gap-2 items-center group hover:text-indigo-600"
					>
						<svg
							className="fill-current"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<title>Library</title>
							<path d="M80-160v-80h800v80H80Zm80-160v-320h80v320h-80Zm160 0v-480h80v480h-80Zm160 0v-480h80v480h-80Zm280 0L600-600l70-40 160 280-70 40Z" />
						</svg>
						Library
					</Link>
				</nav>
				<div className="flex align-middle items-center gap-4">
					{isAuthenticated && (
						<span>Hello, {userInfo?.displayName || userInfo?.email}!</span>
					)}
					<button className="h-fit text-sm self-center" onClick={handleClick}>
						{isAuthenticated ? (
							<span className="inline-flex text-white gap-1 align-middle">
								<svg
									className="fill-current"
									role="img"
									aria-labelledby="logout-button"
									xmlns="http://www.w3.org/2000/svg"
									height="20px"
									viewBox="0 -960 960 960"
									width="20px"
								>
									<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
									<title id="logout-button">Sign out</title>
								</svg>
								Sign out
							</span>
						) : (
							<span>Sign in → </span>
						)}
					</button>
				</div>
			</header>

			<main className="w-screen h-auto overflow-y-scroll min-h-dvh bg-slate-50 flex justify-center items-center">
				<Outlet />
			</main>
			<footer className="p-3 border-t border-slate-200">© Bookit List</footer>
			<Toaster />
			<ModalRoot />
		</div>
	);
}
