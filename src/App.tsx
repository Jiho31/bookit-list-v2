import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import useOpenLibraryAPI from './useOpenLibraryAPI';

type Option = string | number | boolean | undefined;

type Question = {
	no: number;
	question: string;
	options: Option[];
	priority?: number;
};

type Form = {
	[questionNo: string]: Option | Option[];
};

type Book = {
	key?: string;
	author: string;
	title: string;
	coverEditionKey: string;
	publishedYear: number;
};

function App() {
	const { search: fetchBooks, getBookCoverImage } = useOpenLibraryAPI();

	const [num, setNum] = useState(0);
	const [form, setForm] = useState<Question[]>([
		{
			no: 1,
			question: 'How are you feeling today?',
			options: ['Happy', 'Neutral', 'Bad'],
		},
		{
			no: 2,
			question: 'Which do you prefer?',
			options: ['Fiction', 'Non-fiction', "I don't mind"],
		},
		{
			no: 3,
			question: 'Favorite genres?',
			options: ['Romance', 'SF', 'Fantasy', 'Horror', 'Mystery'],
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
		response: Option | Option[],
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
											{option}
										</div>
									))}
								</div>
								<button
									onClick={toPrev}
									disabled={num === 0}
									className="mt-6 border border-gray-300 hover:bg-gray-100 hover:border-red-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{'< Back'}
								</button>
							</>
						) : (
							<section className="flex flex-row gap-6 flex-wrap justify-center">
								{recommendations.map((book, idx) => (
									<div
										key={idx}
										className="flex flex-col w-40 h-46 border border-amber-500 rounded-xl"
									>
										<img src={getBookCoverImage(book.coverEditionKey)} />
										<div>{book.title}</div>
										<div>{book.author}</div>
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
