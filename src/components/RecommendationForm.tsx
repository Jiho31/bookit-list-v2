import type { Question, Form, OptionMeta } from '../types';

function RecommendationForm({
	questionIndex,
	form,
	userResponse,
	setUserResponse,
	setQuestionIndex,
}: {
	questionIndex: number;
	form: Question[];
	userResponse: Form;
	setUserResponse: (userResponse: Form) => void;
	setQuestionIndex: (questionIndex: number) => void;
}) {
	const handleResponse = async (
		questionNum: number,
		response: OptionMeta | OptionMeta[],
	) => {
		// console.log(questionNum, response);
		setUserResponse({ ...userResponse, [questionNum]: response });
		setQuestionIndex(questionIndex + 1);
	};

	const toPrev = () => {
		if (questionIndex === 0) {
			return;
		}

		const newUserResponse = { ...userResponse };
		delete newUserResponse[questionIndex - 1];
		setUserResponse(newUserResponse);
		setQuestionIndex(questionIndex - 1);
	};

	return (
		<>
			<div className="text-gray-600">
				Progress: Question {questionIndex + 1}/{form.length}
			</div>
			<div className="py-10">{form[questionIndex].question}</div>
			<div className="flex flex-row gap-5 flex-wrap justify-center">
				{form[questionIndex].options.map((option, idx) => (
					<div
						key={idx}
						className="flex px-5 py-10 w-36 justify-center bg-amber-100 rounded-lg hover:cursor-pointer hover:bg-amber-200"
						onClick={() => handleResponse(questionIndex + 1, option)}
					>
						{option.label}
					</div>
				))}
			</div>
			<button
				onClick={toPrev}
				disabled={questionIndex === 0}
				className="mt-6 border hover:bg-gray-200 bg-gray-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{'< Back'}
			</button>
		</>
	);
}

export default RecommendationForm;
