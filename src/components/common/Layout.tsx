import { Link, Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
	const { isAuthenticated, handleLogout } = useAuth();
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
		<div className="w-screen h-screen flex flex-col">
			<header className="w-screen min-h-15 text-sm bg-slate-50 border-b border-b-slate-200 px-20 flex justify-between">
				<nav className="flex gap-10 items-center text-slate-900">
					<Link to="/" className="hover:text-indigo-400">
						<img className="w-18 h-auto" src="/logo.png" alt="logo" />
						{/* Main */}
					</Link>
					<Link to="/home" className="hover:text-indigo-400">
						Home
					</Link>
				</nav>
				<button className="h-fit text-sm self-center" onClick={handleClick}>
					{isAuthenticated ? <span>Logout </span> : <span>Login → </span>}
				</button>
			</header>

			<main className="w-screen h-auto min-h-4/5 bg-slate-50 flex justify-center items-center">
				<Outlet />
			</main>
			<footer className="p-3 border-t border-slate-200">© Bookit List</footer>
		</div>
	);
}
