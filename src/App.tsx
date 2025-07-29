import { useEffect, useMemo, useState } from 'react';
import './App.css';
import useOpenLibraryAPI from './useOpenLibraryAPI';

type OptionMeta = {
	id: Emotion | FictionGenre | NonfictionGenre | BookLength | BookType | 'any';
	label: string;
	emoji?: string;
	keywords: string[];
};

type Question = {
	id: number;
	question: string;
	options: OptionMeta[];
	priority?: number;
};

type Form = {
	[questionNo: string]: OptionMeta | OptionMeta[];
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
		keywords: ['fiction'],
	},
	{
		id: 't_nonfiction',
		label: 'Information-based (non-fiction)',
		keywords: ['nonfiction'],
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
		keywords: ['short'], // page 쪽수로 쿼리 만들기
	},
	{
		id: 'l_medium',
		label: 'Medium (150-350 pages)',
		keywords: [],
	},
	{
		id: 'l_long',
		label: 'Long (Over 350 pages)',
		keywords: [],
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
	const {
		search: fetchBooks,
		getBookCoverImage,
		searchBySubject,
	} = useOpenLibraryAPI();

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
	const isFormComplete = useMemo(
		() =>
			num === form.length &&
			Object.entries(userResponse).length === form.length,
		[num, form.length, userResponse],
	);
	const [recommendations, setRecommendations] = useState<Book[]>([]);

	const generateRecommendation = async () => {
		setIsLoading(true);

		try {
			console.log('generating..');

			// @todo 감정 기반으로 키워드 조합 생성해서 api 호출하기
			const books = await fetchBooks('harry potter');

			const dummyRec: Book[] = books?.docs
				.slice(0, 5)
				.map(
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

			setRecommendations(dummyRec);
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

		setUserResponse({ [num - 1]: undefined });
		setNum(num - 1);
	};

	const refreshForm = () => {
		setUserResponse({});
		setNum(0);
	};

	const shuffleRecommendations = () => {
		alert('shuffle!');
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
						{num < form.length ? (
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
											onClick={() => handleResponse(num, option)}
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
							<section className="flex flex-row gap-6 flex-wrap justify-center h-auto">
								{recommendations.map((book, idx) => (
									<div
										key={idx}
										className="flex flex-row gap-3 p-10 w-100 h-auto shadow-md hover:shadow-xl  hover:scale-101 hover:transition-discrete hover:cursor-pointer rounded-xl"
										onClick={() => showBookDetails(book)}
									>
										<img
											className="w-36 h-auto object-cover"
											src={getBookCoverImage(book.coverEditionKey)}
										/>
										<div>
											<div className="font-semibold">{book.title}</div>
											<div>{book.author}</div>
											<div>
												<button>Add to bookshelf</button>
											</div>
										</div>
									</div>
								))}
							</section>
						)}
					</div>
				)}
			</div>

			{isFormComplete ? (
				<div className="flex gap-2 justify-center mt-6">
					<button onClick={refreshForm}>Restart survey </button>
					<button onClick={shuffleRecommendations}>
						More recommendations{' '}
					</button>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default App;
