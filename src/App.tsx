import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/common/Layout';
import {
	MainPage,
	AuthPage,
	LibraryPage,
	SearchPage,
	AppErrorBoundary,
} from './pages';
import { AuthProvider } from './contexts/AuthContext';
import { BookshelfProvider } from './contexts/BookshelfContext';
import { ModalProvider } from './contexts/ModalContext';

const router = createBrowserRouter([
	{
		Component: Layout,
		ErrorBoundary: AppErrorBoundary,
		children: [
			{
				path: '/',
				Component: MainPage,
			},
			{ path: '/auth', Component: AuthPage },
			{ path: '/library', Component: LibraryPage },
			{ path: '/search', Component: SearchPage },
		],
	},
]);

function App() {
	return (
		<AuthProvider>
			<BookshelfProvider>
				<ModalProvider>
					<RouterProvider router={router} />
				</ModalProvider>
			</BookshelfProvider>
		</AuthProvider>
	);
}
export default App;
