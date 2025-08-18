import { Link, Outlet } from 'react-router';

export default function Layout() {
	return (
		<>
			<header className="w-screen h-15 bg-amber-100 px-20">
				<nav className="h-full flex gap-10 items-center">
					<Link to="/">
						{/* <img src="" alt="logo" /> */}
						Main
					</Link>
					<Link to="/home">Home</Link>
				</nav>
			</header>

			<main className="w-screen h-screen flex justify-center items-center">
				<Outlet />
			</main>
			<footer className="p-4 border-t border-b-gray-700">© Bookit List</footer>
		</>
	);
}
