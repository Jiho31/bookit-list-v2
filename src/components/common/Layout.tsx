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
			<header className="w-screen min-h-15 bg-amber-100 px-20 flex justify-between">
				<nav className="flex gap-10 items-center">
					<Link to="/">
						{/* <img src="" alt="logo" /> */}
						Main
					</Link>
					<Link to="/home">Home</Link>
				</nav>
				<button onClick={handleClick}>
					{isAuthenticated ? 'Logout' : 'Login'}
				</button>
			</header>

			<main className="w-screen h-auto flex justify-center items-center">
				<Outlet />
			</main>
			<footer className="p-4 border-t border-b-gray-700">© Bookit List</footer>
		</div>
	);
}
