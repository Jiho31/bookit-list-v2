import { useEffect, useMemo, useState } from 'react';
import useOpenLibraryAPI from '../hooks/useOpenLibraryAPI';
import type { Book, Form } from '../types';
import RecommendationForm from '../components/RecommendationForm';
import BookRecommendations from '../pages/BookRecommendations';
import { questions } from '../consts/form';

const MAX_RECOMMENDATIONS = 8;

function MainPage() {
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

	const [displayContent, setDisplayContent] = useState<
		'mainPage' | 'form' | 'landingPage'
	>('mainPage');

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
					...rest
				}: any) => ({
					...rest,
					author: author_name,
					title,
					key,
					publishedYear: first_publish_year,
					coverEditionKey: cover_edition_key,
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
		<div className="flex-col">
			{displayContent === 'mainPage' && (
				<section className="flex flex-col gap-4">
					<h1 className="text-3xl">
						Welcome to the Book Recommendation System
					</h1>
					<p>
						This is a system that recommends books based on your preferences.
					</p>
					<div className="flex flex-row gap-10 justify-center items-center">
						<button
							className="bg-amber-100 hover:bg-amber-200 rounded-3xl py-20 px-3 w-1/2 min-h-[250px]"
							onClick={() => setDisplayContent('form')}
						>
							<span>❓ Start survey!</span>
							<span>
								<br />
								(Get book recommendations)
							</span>
						</button>
						<button
							className="bg-amber-100 hover:bg-amber-200 rounded-3xl py-20 px-3 w-1/2 min-h-[250px]"
							onClick={() => setDisplayContent('landingPage')}
						>
							🔍 Explore books
						</button>
					</div>
				</section>
			)}

			{displayContent === 'landingPage' && (
				<>
					<div>display bookshelves and search bar</div>
				</>
			)}
			{displayContent === 'form' && (
				<>
					<div>
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
					</div>
				</>
			)}
		</div>
	);
}

export default MainPage;
