import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from './SearchBar';
import { useState } from 'react';

function VerticalSideMenu({
	isVisible,
	close,
}: {
	isVisible: boolean;
	close: () => void;
}) {
	const handlePropagation = (e: React.MouseEvent<HTMLLinkElement>) => {
		e.stopPropagation();
	};

	return (
		<div
			className={`absolute left-0 top-0 w-full h-full z-30 transition-colors duration-300 ${
				isVisible
					? 'bg-black/70 pointer-events-auto'
					: 'bg-transparent pointer-events-none'
			}`}
			onClick={close}
		>
			<nav
				className={`w-[70%] h-full bg-white flex flex-col text-slate-900 transition-transform duration-300 ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
				onClick={handlePropagation}
			>
				<div className="h-15 bg-indigo-200 flex flex-row items-center">
					<button
						type="button"
						className="text-white h-fit bg-inherit"
						onClick={close}
					>
						X
					</button>
					<Link to="/" onClick={close}>
						<img
							className="w-18 h-auto min-w-10"
							src="/logo.png"
							alt="Bookit List logo"
						/>
					</Link>
				</div>
				<Link
					to="/"
					onClick={close}
					className="flex flex-row gap-3 items-center px-6 py-4 group text-sm sm:text-md text-slate-600 hover:text-slate-800 hover:bg-indigo-50 rounded-xl"
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
					to="/library"
					onClick={close}
					className="flex flex-row gap-3 items-center px-6 py-4 group text-center text-sm sm:text-md text-slate-600 hover:text-slate-800 hover:bg-indigo-50 rounded-xl"
				>
					<svg
						className="fill-current"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
					>
						<title>My Shelves</title>
						<path d="M80-160v-80h800v80H80Zm80-160v-320h80v320h-80Zm160 0v-480h80v480h-80Zm160 0v-480h80v480h-80Zm280 0L600-600l70-40 160 280-70 40Z" />
					</svg>
					My Shelves
				</Link>
				<Link
					to="/search"
					onClick={close}
					className="flex flex-row gap-3 items-center px-6 py-4 group text-center text-sm sm:text-md text-slate-600 hover:text-slate-800 hover:bg-indigo-50 rounded-xl"
				>
					<svg
						className="fill-current"
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						role="img"
						aria-labelledby="search-icon"
					>
						<title id="search-icon">Magnifying glass</title>
						<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
					</svg>
					Search books
				</Link>
			</nav>
		</div>
	);
}

export function NavigationBar() {
	const { isAuthenticated, handleLogout, userInfo } = useAuth();
	const navigate = useNavigate();
	const [isNavDisplayed, setIsNavDisplayed] = useState(false);

	const closeNavMenu = () => {
		setIsNavDisplayed(false);
	};

	const handleClick = () => {
		if (isAuthenticated) {
			handleLogout();
		} else {
			navigate('/auth');
		}
	};

	return (
		<header className="w-full min-h-15 text-sm bg-slate-50 border-b border-b-slate-200 px-4 sm:px-6 md:px-10 lg:px-20 flex justify-between">
			<div
				className="self-center cursor-pointer sm:hidden"
				onClick={() => setIsNavDisplayed(true)}
			>
				<svg
					role="img"
					aria-labelledby="nav-sidebar-menu-buton"
					className="fill-current w-6 h-6"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 -960 960 960"
				>
					<title id="nav-sidebar-menu-buton">navigation menu</title>
					<path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
				</svg>
			</div>
			<VerticalSideMenu isVisible={isNavDisplayed} close={closeNavMenu} />
			{/* <nav className="flex gap-2 md:gap-10 items-center text-slate-900">
				<Link to="/">
					<img className="w-18 h-auto min-w-10" src="/logo.png" alt="logo" />
				</Link>
				<Link
					to="/"
					className="inline-flex flex-col sm:flex-row gap-0.5 sm:gap-2 items-center group text-sm sm:text-md text-slate-600 hover:text-slate-800 hover:bg-indigo-50 py-2 px-3 rounded-xl"
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
					to="/library"
					className="inline-flex flex-col sm:flex-row gap-0.5 sm:gap-2 items-center group text-center text-sm sm:text-md text-slate-600 hover:text-slate-800 hover:bg-indigo-50 py-2 px-3 rounded-xl"
				>
					<svg
						className="fill-current"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
					>
						<title>My Shelves</title>
						<path d="M80-160v-80h800v80H80Zm80-160v-320h80v320h-80Zm160 0v-480h80v480h-80Zm160 0v-480h80v480h-80Zm280 0L600-600l70-40 160 280-70 40Z" />
					</svg>
					My Shelves
				</Link>
			</nav> */}
			<Link to="/" className="sm:hidden self-center">
				<img className="w-18 h-auto min-w-10" src="/logo.png" alt="logo" />
			</Link>
			<div className="flex align-middle items-center gap-4">
				<span className="hidden sm:block">
					<SearchBar />
				</span>
				{isAuthenticated && (
					<p className="px-2 hidden sm:block">
						Hello, {userInfo?.displayName || userInfo?.email}!
					</p>
				)}

				<button
					type="button"
					className="h-fit text-sm self-center"
					onClick={handleClick}
				>
					{isAuthenticated ? (
						<span className="inline-flex text-white gap-1 align-middle">
							<svg
								className="fill-current hidden sm:block"
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
	);
}
