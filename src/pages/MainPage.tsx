import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useOpenLibraryAPI from '../hooks/useOpenLibraryAPI';
import type { Book, Form, SearchMetaInfo, SearchResultDocs } from '../types';
import RecommendationForm from '../components/RecommendationForm';
import BookRecommendations from '../pages/BookRecommendations';
import { questions } from '../consts/form';

const MAX_RECOMMENDATIONS = 9;
const defaultMeta: SearchMetaInfo = {
	total: 0,
	pageIndex: 1,
	pageSize: MAX_RECOMMENDATIONS,
};

function MainPage() {
	const navigate = useNavigate();
	const { searchByQuery: fetchBooks } = useOpenLibraryAPI();

	const [questionIndex, setQuestionIndex] = useState(0);
	const [userResponse, setUserResponse] = useState<Form>({});
	const [isLoading, setIsLoading] = useState(false);
	const isFormComplete = useMemo(
		() => questionIndex === questions.length,
		[questionIndex],
	);
	const [fetchedBooks, setFetchedBooks] = useState<Book[]>([]);
	const [recommendations, setRecommendations] = useState<Book[]>([]);
	const [metaInfo, setMetaInfo] = useState(defaultMeta);

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
			const query = makeQuery();
			const books = await fetchBooks(query);
			const parsedResult =
				books?.docs.map(
					({
						author_name,
						title,
						// cover_edition_key,
						first_publish_year,
						key,
						cover_i,
						...rest
					}: SearchResultDocs) => ({
						...rest,
						author:
							typeof author_name == 'string' ? author_name : author_name[0],
						title,
						key,
						publishedYear: first_publish_year,
						// coverEditionKey: cover_edition_key || null,
						coverId: cover_i || undefined,
					}),
				) || [];

			setFetchedBooks(parsedResult);
			setMetaInfo({
				pageIndex: 1,
				pageSize: MAX_RECOMMENDATIONS,
				total: books?.numFound || 0,
			});

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
		setMetaInfo(defaultMeta);
	};

	const shuffleRecommendations = () => {
		if (
			metaInfo.pageIndex === Math.ceil(fetchedBooks.length / metaInfo.pageSize)
		) {
			// @todo call book search API for more results
			// or
			// Recommend user to do the survey again ?
			setFetchedBooks([]);
			setRecommendations([]);
			return;
		}

		setIsLoading(true);
		try {
			setRecommendations(
				fetchedBooks.slice(
					metaInfo.pageIndex * metaInfo.pageSize,
					metaInfo.pageIndex * metaInfo.pageSize + metaInfo.pageSize,
				),
			);
			setMetaInfo((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isFormComplete) {
			void generateRecommendation();
		}
	}, [isFormComplete]);

	return (
		<div className="w-full h-auto">
			{displayContent === 'mainPage' && (
				<section className="flex flex-col w-full h-full py-10 sm:py-0 align-middle items-center justify-center gap-4 text-center">
					<h1 className="max-w-2/3 self-center sm:text-slate-900 text-3xl md:text-4xl lg:text-6xl font-extrabold">
						Bookit List: Track, Organize, and Discover
					</h1>
					<p className="text-slate-600 max-w-2/3 py-6 md:py-10">
						Your comprehensive system to manage your reads and find your next
						favorite book.
					</p>
					<div className="flex flex-col md:flex-row max-w-[90%] gap-4 sm:gap-10 justify-center items-center">
						<button
							type="button"
							className="group flex flex-col gap-2 bg-white text-slate-900 hover:text-indigo-50 hover:bg-indigo-400 border border-slate-200 rounded-2xl py-10 px-8 w-[100%] md:w-auto min-w-[90%] md:min-w-64"
							onClick={() => setDisplayContent('form')}
						>
							<span className="w-fit h-fit self-center px-4 py-2 bg-slate-100 rounded-full group-hover:bg-amber-50">
								✨
							</span>
							<span className="font-bold text-xl">
								Get Personalized Recommendations
							</span>
							<span className="text-sm text-slate-600 group-hover:text-indigo-50">
								Start the short survey now!
							</span>
						</button>
						<button
							type="button"
							className="group flex flex-col gap-2 bg-white text-slate-900 hover:text-indigo-50 hover:bg-indigo-400 border border-slate-200 rounded-2xl py-10 px-8 w-[100%] md:w-auto min-w-[90%] md:min-w-64 "
							onClick={() => navigate('/library')}
						>
							<span className="w-fit h-fit self-center px-4 py-2 bg-slate-100 rounded-full group-hover:bg-amber-50">
								🔍
							</span>
							<span className="font-bold text-xl">View My Bookshelves</span>
							<span className="text-sm text-slate-600 group-hover:text-indigo-50">
								Organize your reads and add new books.
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
							metaInfo={metaInfo}
						/>
					)}
				</>
			)}
		</div>
	);
}

export default MainPage;
