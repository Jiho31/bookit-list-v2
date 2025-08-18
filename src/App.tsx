import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/common/Layout';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';
import { AuthProvider } from './contexts/AuthContext';

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <MainPage />,
			},
			{ path: '/home', element: <HomePage /> },
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
