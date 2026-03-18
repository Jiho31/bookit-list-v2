import { Link, useRouteError, isRouteErrorResponse } from 'react-router';

const AppErrorBoundary = () => {
	const error = useRouteError();
	if (!isRouteErrorResponse(error)) {
		console.error('Error boundary caught an error:', error);
		return <div>An unexpected error occurred.</div>;
	}

	if (error.status === 404) {
		return (
			<div className="flex flex-col justify-center px-15 py-15 gap-5">
				<h1 className="text-3xl font-semibold text-indigo-600">
					Page Not Found
				</h1>
				<p>The page you are looking for does not exist.</p>
				<Link to="/" className="text-indigo-500 hover:underline">
					Back Home
				</Link>
			</div>
		);
	}

	return <div>AppErrorBoundary: </div>;
};

export default AppErrorBoundary;
