import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/common/Layout';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import LibraryPage from './pages/LibraryPage';
import BookListPage from './pages/BookListPage';
import { AuthProvider } from './contexts/AuthContext';
import { BookshelfProvider } from './contexts/BookshelfContext';
import { ModalProvider } from './contexts/ModalContext';

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <MainPage />,
			},
			{ path: '/auth', element: <AuthPage /> },
			{ path: '/library', element: <LibraryPage /> },
			{ path: '/search', element: <BookListPage /> },
		],
	},
]);

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BookshelfProvider>
					<ModalProvider>
						<RouterProvider router={router} />
					</ModalProvider>
				</BookshelfProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
export default App;
