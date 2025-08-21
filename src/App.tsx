import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/common/Layout';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <MainPage />,
			},
			{ path: '/auth', element: <AuthPage /> },
			// { path: '/home', element: <AuthPage /> },
		],
	},
]);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}
export default App;
