import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/common/Layout';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
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
			{ path: '/home', element: <HomePage /> },
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
