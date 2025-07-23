import { useEffect, useState } from 'react';
import './App.css';

type Form = {
	question: string;
	options: string[];
	selected: object | string | boolean | undefined;
	priority?: number;
};

function App() {
	const [num, setNum] = useState(0);
	const [form, setForm] = useState<Form[]>([
		{
			question: 'How are you feeling today?',
			options: ['Happy', 'Neutral', 'Bad'],
			selected: undefined,
		},
		{
			question: 'Which do you prefer?',
			options: ['Fiction', 'Non-fiction', "I don't mind"],
			selected: undefined,
		},
		{
			question: 'Favorite genres?',
			options: ['Romance', 'SF', 'Fantasy', 'Horror', 'Mystery'],
			selected: undefined,
		},
	]);
	const [isLoading, setIsLoading] = useState(false);

	const generateRecommendation = async () => {
		setIsLoading(true);

		try {
			console.log('generating..');
			await setTimeout(() => {
				setIsLoading(false);
			}, 2000);
		} catch (err) {
			console.error(err);
		} /* finally {
			setIsLoading(false);
		} */
	};

	const handleResponse = async (questionNum: number, response: String) => {
		console.log(questionNum, response);

		// @todo num 값이 끝에 달했는지 확인
		// if (questionNum >= form.length) {
		// 	setIsLoading(true);

		// 	await generateRecommendation();

		// 	setIsLoading(false);
		// 	return;
		// }

		const newForm = [...form];
		newForm[questionNum] = {
			...newForm[questionNum],
			selected: response,
		};
		setForm(newForm);
		setNum(num + 1);
	};

	useEffect(() => {
		if (num == form.length) {
			generateRecommendation();
		}
	}, [num]);

	return (
		<>
			<p>Welcome! 🤗</p>

			<div>
				{isLoading ? (
					<div> Generating recommendations ... </div>
				) : (
					<div>
						{num < form.length ? (
							<>
								<div>{form[num].question}</div>
								{form[num].options.map((op, idx) => (
									<div key={idx} onClick={() => handleResponse(num, op)}>
										{op}
									</div>
								))}
							</>
						) : (
							<div> Recommendations : </div>
						)}
					</div>
				)}
			</div>
		</>
	);
}

export default App;
