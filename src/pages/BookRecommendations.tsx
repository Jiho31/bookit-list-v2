import { useMemo } from 'react';
import type { Book } from '../types';
import BookList from '../components/BookList';
import Header from '../components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function BookRecommendations({
	isLoading,
	recommendations,
	refreshForm,
	shuffleRecommendations,
}: {
	isLoading: boolean;
	recommendations: Book[];
	refreshForm: () => void;
	shuffleRecommendations: () => void;
}) {
	const isEmpty = useMemo(
		() => recommendations.length === 0,
		[recommendations],
	);

	return (
		<section className="flex flex-col p-10">
			{isLoading ? (
				<div className="w-full h-full m-auto">
					<LoadingSpinner width={48} height={48} />
					<p className="text-center">Generating recommendations ...</p>
				</div>
			) : (
				<>
					<Header
						className="text-center"
						title="Book recommendations for you 🤗"
					/>
					{isEmpty ? (
						<div className="text-center text-gray-500 py-10">
							No books found for your preferences. <br />
							Start over to adjust your choices and discover great reads. :)
						</div>
					) : (
						<BookList data={recommendations} />
					)}
					<div className="flex gap-2 justify-center mt-6">
						<button
							className="border rounded-b-md bg-white text-indigo-600 hover:bg-indigo-600 hover:text-indigo-50"
							onClick={refreshForm}
						>
							Start Over
							{/* New Search */}
						</button>
						<button
							className="border rounded-b-md bg-white text-indigo-600 hover:bg-indigo-600 hover:text-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
							disabled={isEmpty}
							onClick={shuffleRecommendations}
						>
							More Recommendations
						</button>
					</div>
				</>
			)}
		</section>
	);
}

export default BookRecommendations;
