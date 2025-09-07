import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useOpenLibraryAPI from '../hooks/useOpenLibraryAPI';
import type { Book, Form } from '../types';
import RecommendationForm from '../components/RecommendationForm';
import BookRecommendations from '../pages/BookRecommendations';
import { questions } from '../consts/form';

const MAX_RECOMMENDATIONS = 8;

function MainPage() {
	const navigate = useNavigate();
	const { search: fetchBooks } = useOpenLibraryAPI();

	const [questionIndex, setQuestionIndex] = useState(0);
	const [userResponse, setUserResponse] = useState<Form>({});
	const [isLoading, setIsLoading] = useState(false);
	const isFormComplete = useMemo(
		() => questionIndex === questions.length,
		[questionIndex],
	);
	const [fetchedBooks, setFetchedBooks] = useState<Book[]>([]);
	const [recommendations, setRecommendations] = useState<Book[]>([]);
	const [pageIndex, setPageIndex] = useState(1);

	const [displayContent, setDisplayContent] = useState<'mainPage' | 'form'>(
		'mainPage',
	);

	const makeQuery = () => {
		const query1 = userResponse[1].keywords.join(' OR ') || '';
		const query2 = userResponse[2].queries?.join(' AND ') || '';
		const query3 = userResponse[3].queries?.join('') || '';

		return [query1, query2, query3].filter((q) => q !== '').join(' AND ');
	};

	const generateRecommendation = async () => {
		setIsLoading(true);

		try {
			// console.log('generating..');

			const query = makeQuery();
			// console.log(query, '<<<< QUERY');
			const books = await fetchBooks(query);
			const parsedResult: Book[] = books?.docs.map(
				({
					author_name,
					title,
					cover_edition_key,
					first_publish_year,
					key,
					cover_i,
					...rest
				}: any) => ({
					...rest,
					author: author_name,
					title,
					key,
					publishedYear: first_publish_year,
					// coverEditionKey: cover_edition_key || null,
					coverId: cover_i || null,
				}),
			);

			setFetchedBooks(parsedResult);
			setRecommendations(parsedResult.slice(0, MAX_RECOMMENDATIONS));
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const refreshForm = () => {
		setUserResponse({});
		setQuestionIndex(0);
		setPageIndex(1);
	};

	const shuffleRecommendations = async () => {
		if (pageIndex === Math.ceil(fetchedBooks.length / MAX_RECOMMENDATIONS)) {
			// @todo call book search API for more results
			// or
			// Recommend user to do the survey again ?
			setFetchedBooks([]);
			setRecommendations([]);
			return;
		}

		await setIsLoading(true);
		try {
			await setRecommendations(
				fetchedBooks.slice(
					pageIndex * MAX_RECOMMENDATIONS,
					pageIndex * MAX_RECOMMENDATIONS + MAX_RECOMMENDATIONS,
				),
			);
			setPageIndex(pageIndex + 1);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isFormComplete) {
			generateRecommendation();
		}
	}, [isFormComplete]);

	return (
		<div className="w-full h-auto">
			{displayContent === 'mainPage' && (
				<section className="flex flex-col gap-4 text-center">
					<h1 className="max-w-2/3 self-center text-slate-900 text-6xl font-extrabold">
						Welcome to the Book Recommendation System
					</h1>
					<p className="text-slate-600 py-6">
						This is a system that recommends books based on your preferences.
					</p>
					<div className="flex flex-row gap-10 justify-center items-center">
						<button
							className="group flex flex-col gap-2 bg-white text-slate-900 hover:text-indigo-50 hover:bg-indigo-400 border border-slate-200 rounded-2xl py-10 px-8 w-auto"
							onClick={() => setDisplayContent('form')}
						>
							<span className="w-fit h-fit self-center px-4 py-2 bg-slate-50 rounded-full group-hover:bg-amber-50">
								✨
							</span>
							<span className="font-bold text-xl">Get Recommendations</span>
							<span className="text-sm text-slate-600 group-hover:text-indigo-50">
								Start survey!
							</span>
						</button>
						<button
							className="group flex flex-col gap-2 bg-white text-slate-900 hover:text-indigo-50 hover:bg-indigo-400 border border-slate-200 rounded-2xl py-10 px-8 w-auto"
							onClick={() => navigate('/home')}
						>
							<span className="w-fit h-fit self-center px-4 py-2 bg-slate-50 rounded-full group-hover:bg-amber-50">
								🔍
							</span>
							<span className="font-bold text-xl">Browse Books</span>
							<span className="text-sm text-slate-600 group-hover:text-indigo-50">
								Explore library
								{/* Bookshelf */}
							</span>
						</button>
					</div>
				</section>
			)}
			{displayContent === 'form' && (
				<>
					{!isFormComplete ? (
						<RecommendationForm
							questionIndex={questionIndex}
							userResponse={userResponse}
							setUserResponse={setUserResponse}
							setQuestionIndex={setQuestionIndex}
						/>
					) : (
						<BookRecommendations
							isLoading={isLoading}
							recommendations={recommendations}
							refreshForm={refreshForm}
							shuffleRecommendations={shuffleRecommendations}
						/>
					)}
				</>
			)}
		</div>
	);
}

export default MainPage;
