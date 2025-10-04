import { useState } from 'react';
import { useNavigate } from 'react-router';

function SearchBar() {
	const navigate = useNavigate();
	const [keywordInput, setKeywordInput] = useState('');

	const handleBookSearch = () => {
		// 1. keyword 값 검증 ?? 특수문자 제거!
		const validatedKeyword = keywordInput.trim();

		void navigate(`/search?keyword=${validatedKeyword}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') {
			return;
		}
		handleBookSearch();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKeywordInput(e.target.value);
	};

	return (
		<input
			className="w-full px-5 py-3 rounded-3xl bg-white border border-slate-400"
			placeholder="Search books (Title, author, ISBN)"
			onKeyDown={handleKeyDown}
			onChange={handleInputChange}
			value={keywordInput}
		/>
	);
}

export default SearchBar;
