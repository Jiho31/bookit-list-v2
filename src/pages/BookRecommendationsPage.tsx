import type { Book } from '../types';
import BookList from '../components/BookList';
import Header from '../components/common/Header';

function BookRecommendationsPage({
	isEmpty,
	recommendations,
	refreshForm,
	shuffleRecommendations,
}: {
	isEmpty: boolean;
	recommendations: Book[];
	refreshForm: () => void;
	shuffleRecommendations: () => void;
}) {
	return (
		<>
			<Header title="Book recommendations for you 🤗" />
			{isEmpty ? (
				<div className="text-center text-gray-500 py-10">
					No books found for your preferences. <br />
					Start over to adjust your choices and discover great reads. :)
				</div>
			) : (
				<BookList recommendations={recommendations} />
			)}
			<div className="flex gap-2 justify-center mt-6">
				<button
					className="border rounded-b-md bg-gray-100 hover:bg-gray-200"
					onClick={refreshForm}
				>
					Start Over
					{/* New Search */}
				</button>
				<button
					className="border rounded-b-md  bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isEmpty}
					onClick={shuffleRecommendations}
				>
					More Recommendations
				</button>
			</div>
		</>
	);
}

export default BookRecommendationsPage;
