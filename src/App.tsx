import { useEffect, useMemo, useState } from 'react';
import './App.css';
import useOpenLibraryAPI from './hooks/useOpenLibraryAPI';
import type { Book, Question, Form, OptionMeta } from './types';
import BookList from './components/BookList';
import RecommendationForm from './components/RecommendationForm';

const MAX_RECOMMENDATIONS = 8;

type Bookshelf = {};

const emotionOptions: OptionMeta[] = [
	{
		id: 'em_happy',
		label: 'Happy',
		emoji: '☺️',
		keywords: ['happy', 'comedy', 'romance', 'adventure', 'feel-good'],
	},
	{
		id: 'em_sad',
		label: 'Sad',
		emoji: '😔',
		keywords: ['drama', 'coming of age', 'healing', 'emotional'],
	},
	{
		id: 'em_angry',
		label: 'Angry',
		emoji: '😤',
		keywords: ['thriller', 'justice', 'revenge', 'dark fantasy', 'political'],
	},
	{
		id: 'em_relaxed', // relaxed
		label: 'Relaxed',
		emoji: '😌',
		keywords: ['Nature', 'Travel', 'Essay'],
	},
	{
		id: 'em_tired',
		label: 'Tired',
		emoji: '😴',
		keywords: ['Short stories', 'Easy read', 'Humor', 'Light'],
	},
	{
		id: 'em_confused',
		label: 'Confused',
		emoji: '🤯',
		keywords: ['Mystery', 'Scifi', 'Psychological'],
	},
	{
		id: 'em_excited',
		label: 'Excited',
		emoji: '🤩',
		keywords: [
			'Fantasy',
			'Adventure',
			'Romance',
			'romantic',
			'romantic comedy',
			'Hopeful',
		],
	},
];

const bookTypeOptions: OptionMeta[] = [
	{
		id: 't_fiction',
		label: 'Story-driven (fiction)',
		keywords: [
			/* 'fiction' */
		],
		queries: ['subject_key:fiction', '-subject_key:nonfiction'],
	},
	{
		id: 't_nonfiction',
		label: 'Information-based (non-fiction)',
		keywords: [
			/* 'nonfiction' */
		],
		queries: ['subject_key:nonfiction', '-subject_key:fiction'],
	},
	{
		id: 'any',
		label: "I don't mind",
		keywords: [],
	},
];

const bookLengthOptions: OptionMeta[] = [
	{
		id: 'l_short',
		label: 'Short (Under 150 pages)',
		keywords: [], // page 쪽수로 쿼리 만들기
		queries: ['number_of_pages:[1 TO 150]'],
	},
	{
		id: 'l_medium',
		label: 'Medium (150-350 pages)',
		keywords: [],
		queries: ['number_of_pages:[150 TO 350]'],
	},
	{
		id: 'l_long',
		label: 'Long (Over 350 pages)',
		keywords: [],
		queries: ['number_of_pages:[350 TO *]'],
	},
	{
		id: 'any',
		label: "I don't mind",
		keywords: [],
		queries: [],
	},
];

const genreOptions: OptionMeta[] = [
	{
		id: 'g_biography',
		label: 'Biography',
		keywords: ['biography'],
	},
	{
		id: 'g_drama',
		label: 'Drama',
		keywords: ['drama'],
	},
];

// keyword 후보 : ['young adult', 'family', 'passion', 'motivating', 'philosophical', 'introspective', ]

function App() {
	const { search: fetchBooks } = useOpenLibraryAPI();

	const [questionIndex, setQuestionIndex] = useState(0);
	const [form, setForm] = useState<Question[]>([
		{
			id: 1,
			question: '🫥 How are you feeling today?',
			options: emotionOptions,
			// options: ['Happy', 'Sad', 'Angry'],
		},
		{
			id: 2,
			question:
				'📖 Would you like something more narrative or more informative?',
			options: bookTypeOptions,
		},
		{
			id: 3,
			question: '📏 How long of a book would you prefer?',
			options: bookLengthOptions,
		},
		/* {
			id: 4,
			question: '📚 What kind of stories are you in the mood for?',
			options: genreOptions, // @todo 2번 문제 선택에 따라 4번 문제 option 선택지가 달라짐
		}, */
	]);
	const [userResponse, setUserResponse] = useState<Form>({});
	const [isLoading, setIsLoading] = useState(false);
	const isFormComplete = useMemo(
		() => questionIndex === form.length,
		[questionIndex, form.length],
	);
	const [fetchedBooks, setFetchedBooks] = useState<Book[]>([]);
	const [recommendations, setRecommendations] = useState<Book[]>([]);
	const [pageIndex, setPageIndex] = useState(1);
	const isEmpty = useMemo(
		() => recommendations.length === 0,
		[recommendations],
	);

	// @todo query 변수 삭제
	const [query, setQuery] = useState('');

	const makeQuery = () => {
		const query1 = userResponse[1].keywords.join(' OR ') || '';
		const query2 = userResponse[2].queries?.join(' AND ') || '';
		const query3 = userResponse[3].queries?.join('') || '';

		return [query1, query2, query3].filter((q) => q !== '').join(' AND ');
	};

	const generateRecommendation = async () => {
		setIsLoading(true);

		try {
			console.log('generating..');

			const query = makeQuery();
			// console.log(query, '<<<< QUERY');
			setQuery(query);

			const books = await fetchBooks(query);
			const parsedResult: Book[] = books?.docs.map(
				({
					author_name,
					title,
					cover_edition_key,
					first_publish_year,
					key,
				}: any) => ({
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
			<p className="py-10 text-2xl underline font-bold">
				{isFormComplete ? 'Book recommendations for you 🤗' : 'Welcome! 🤗'}
			</p>

			<div>
				{isLoading ? (
					<div> Generating recommendations ... </div>
				) : (
					<div>
						{!isFormComplete ? (
							<RecommendationForm
								questionIndex={questionIndex}
								form={form}
								userResponse={userResponse}
								setUserResponse={setUserResponse}
								setQuestionIndex={setQuestionIndex}
							/>
						) : (
							<>
								{isEmpty ? (
									<div className="text-center text-gray-500 py-10">
										No books found for your preferences. <br />
										Start over to adjust your choices and discover great reads.
										:)
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
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
