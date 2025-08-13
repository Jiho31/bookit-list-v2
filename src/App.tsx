import { createBrowserRouter, RouterProvider } from 'react-router';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainPage />,
	},
	{ path: '/home', element: <HomePage /> },
]);

function App() {
	return <RouterProvider router={router} />;
}
export default App;
