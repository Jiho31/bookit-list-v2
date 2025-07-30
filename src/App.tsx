import { useEffect, useMemo, useState } from 'react';
import './App.css';
import useOpenLibraryAPI from './useOpenLibraryAPI';

const MAX_RECOMMENDATIONS = 8;

type OptionMeta = {
	id: Emotion | FictionGenre | NonfictionGenre | BookLength | BookType | 'any';
	label: string;
	emoji?: string;
	keywords: string[];
	queries?: string[];
};

type Question = {
	id: number;
	question: string;
	options: OptionMeta[];
	priority?: number;
};

type Form = {
	[questionNo: string]: OptionMeta;
};

type Book = {
	key?: string;
	author: string;
	title: string;
	coverEditionKey: string;
	publishedYear: number;
};

type Bookshelf = {};

type Emotion =
	| 'em_happy'
	| 'em_sad'
	| 'em_angry'
	| 'em_tired'
	| 'em_confused'
	| 'em_excited'
	| 'em_relaxed';

type FictionGenre =
	| 'g_romance'
	| 'g_sf'
	| 'g_fantasy'
	| 'g_horror'
	| 'g_mystery'
	| 'g_drama'
	| 'g_humor';

type NonfictionGenre =
	| 'g_essay'
	| 'g_science'
	| 'g_history'
	| 'g_biography'
	| 'g_philosophy'
	| 'g_selfHelp';

type BookLength = 'l_short' | 'l_medium' | 'l_long';

type BookType = 't_fiction' | 't_nonfiction';

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
	const { search: fetchBooks, getBookCoverImage } = useOpenLibraryAPI();

	const [num, setNum] = useState(0);
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
		{
			id: 4,
			question: '📚 What kind of stories are you in the mood for?',
			options: genreOptions, // @todo 2번 문제 선택에 따라 4번 문제 option 선택지가 달라짐
		},
	]);
	const [userResponse, setUserResponse] = useState<Form>({});
	const [isLoading, setIsLoading] = useState(false);
	const isFormComplete = useMemo(() => num === form.length, [num, form.length]);
	const [fetchedBooks, setFetchedBooks] = useState<Book[]>([]);
	const [recommendations, setRecommendations] = useState<Book[]>([]);
	const [pageIndex, setPageIndex] = useState(1);

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

	const handleResponse = async (
		questionNum: number,
		response: OptionMeta | OptionMeta[],
	) => {
		// console.log(questionNum, response);

		setUserResponse({ ...userResponse, [questionNum]: response });
		setNum(num + 1);
	};

	const toPrev = () => {
		if (num === 0) {
			return;
		}

		const newUserResponse = { ...userResponse };
		delete newUserResponse[num - 1];
		setUserResponse(newUserResponse);
		setNum(num - 1);
	};

	const refreshForm = () => {
		setUserResponse({});
		setNum(0);
		setPageIndex(1);
	};

	const shuffleRecommendations = async () => {
		if (pageIndex === Math.ceil(fetchedBooks.length / MAX_RECOMMENDATIONS)) {
			alert('shuffle22!');
			// @todo call book search API for more results
			// or
			// Recommend user to do the survey again ?
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

	const showBookDetails = (book: Book) => {
		console.log(book, '### DETAILS');
	};

	useEffect(() => {
		if (num === form.length) {
			generateRecommendation();
		}
	}, [num]);

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
							<>
								<div className="text-gray-600">
									Progress: Question {num + 1}/{form.length}
								</div>
								<div className="py-10">{form[num].question}</div>
								<div className="flex flex-row gap-5 flex-wrap justify-center">
									{form[num].options.map((option, idx) => (
										<div
											key={idx}
											className="flex px-5 py-10 w-36 justify-center bg-amber-100 rounded-lg hover:cursor-pointer hover:bg-amber-200"
											onClick={() => handleResponse(num + 1, option)}
										>
											{option.label}
										</div>
									))}
								</div>
								<button
									onClick={toPrev}
									disabled={num === 0}
									className="mt-6 border hover:border-gray-300 bg-gray-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{'< Back'}
								</button>
							</>
						) : (
							<>
								<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 max-w-6xl mx-auto">
									{recommendations.map((book, idx) => (
										<div
											key={idx}
											className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-103 cursor-pointer overflow-hidden max-w-xs h-90"
											onClick={() => showBookDetails(book)}
										>
											<div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
												<img
													className="w-full h-full object-cover"
													src={getBookCoverImage(book.coverEditionKey)}
													alt={`Cover of ${book.title}`}
													onError={(e) => {
														const target = e.target as HTMLImageElement;
														target.style.display = 'none';
														const parent = target.parentElement;
														if (parent) {
															parent.innerHTML = `
															<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-amber-100 to-amber-200">
																<div class="text-center text-amber-800">
																	<div class="text-4xl mb-2">📚</div>
																	<div class="text-sm font-medium">No Cover Available</div>
																</div>
															</div>
														`;
														}
													}}
												/>
											</div>
											<div className="p-4 flex-1 flex flex-col middle min-h-0">
												<div className="relative group">
													<h3
														className="font-bold text-md mb-2 text-gray-800 truncate"
														title={book.title}
													>
														{book.title}
													</h3>
												</div>
												<div className="relative group">
													<p
														className="text-gray-600 mb-3 text-sm truncate"
														title={book.author}
													>
														{book.author}
													</p>
												</div>
												{book.publishedYear && (
													<p className="text-gray-500 text-xs mb-3">
														{book.publishedYear}
													</p>
												)}
												<button className="mt-auto bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
													Add to bookshelf
												</button>
											</div>
										</div>
									))}
								</section>
								<div className="flex gap-2 justify-center mt-6">
									<button
										className="border rounded-b-md bg-gray-100 hover:bg-gray-200"
										onClick={refreshForm}
									>
										Restart survey
									</button>
									<button
										className="border rounded-b-md  bg-gray-100 hover:bg-gray-200"
										onClick={shuffleRecommendations}
									>
										More recommendations
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
