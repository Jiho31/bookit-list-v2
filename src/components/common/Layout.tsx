import { Outlet } from 'react-router';
// import { useEffect } from 'react';
import { Toaster } from 'sonner';
import ModalRoot from './ModalRoot';
import { NavigationBar } from '../NavigationBar';

export default function Layout() {
	return (
		<div id="app-container" className="w-full h-auto flex flex-col">
			<NavigationBar />
			<main className="w-full h-auto overflow-y-auto min-h-dvh bg-slate-50 flex items-stretch">
				<Outlet />
			</main>
			<footer className="p-5 text-center border-t border-slate-200">
				© Bookit List
			</footer>
			<Toaster />
			<ModalRoot />
		</div>
	);
}
