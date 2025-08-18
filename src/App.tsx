import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/common/Layout';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';

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
	return <RouterProvider router={router} />;
}
export default App;
