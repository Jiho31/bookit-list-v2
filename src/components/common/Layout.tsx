import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const handleClick = () => {
		if (isAuthenticated) {
			logout();
		} else {
			// direct to user info page (?)
			navigate('/auth');
		}
	};

	return (
		<>
			<header className="w-screen h-15 bg-amber-100 px-20 flex justify-between">
				<nav className="flex gap-10 items-center">
					<Link to="/">
						{/* <img src="" alt="logo" /> */}
						Main
					</Link>
					{/* <Link to="/home">Home</Link> */}
				</nav>
				<button onClick={handleClick}>
					{isAuthenticated ? 'Logout' : 'Login'}
				</button>
			</header>

			<main className="w-screen h-screen flex justify-center items-center">
				<Outlet />
			</main>
			<footer className="p-4 border-t border-b-gray-700">© Bookit List</footer>
		</>
	);
}
