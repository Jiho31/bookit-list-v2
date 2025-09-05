import { questions } from '../../consts/form';
import type { Form, OptionMeta } from '../../types';
import Header from '../common/Header';

function RecommendationForm({
	questionIndex,
	userResponse,
	setUserResponse,
	setQuestionIndex,
}: {
	questionIndex: number;
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
		<section className="flex flex-col items-center">
			<Header title="Welcome! 🤗" />
			<div className="text-slate-600 text-sm">
				Progress: Question {questionIndex + 1}/{questions.length}
			</div>
			<div className="py-10 text-slate-900">
				{questions[questionIndex].question}
			</div>
			<div className="max-w-2/3 xs:max-w-full flex flex-row gap-5 flex-wrap justify-center">
				{questions[questionIndex].options.map((option, idx) => (
					<div
						key={idx}
						className="flex px-5 py-10 w-36 h-[120px] justify-center items-center text-slate-600 bg-white rounded-lg border border-slate-200 hover:cursor-pointer hover:bg-indigo-600 hover:text-indigo-50 scale-100 hover:scale-110 transition-all duration-100"
						onClick={() => handleResponse(questionIndex + 1, option)}
					>
						{option.label}
					</div>
				))}
			</div>
			<button
				onClick={toPrev}
				disabled={questionIndex === 0}
				className="mt-6 border bg-white text-indigo-600 hover:bg-indigo-600 hover:text-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
			>
				{'< Back'}
			</button>
		</section>
	);
}

export default RecommendationForm;
