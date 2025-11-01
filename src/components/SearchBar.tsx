import { useState } from 'react';
import { useNavigate } from 'react-router';

function SearchBar() {
	const navigate = useNavigate();
	const [keywordInput, setKeywordInput] = useState('');

	const handleBookSearch = () => {
		// 1. keyword 값 검증 ?? 특수문자 제거!
		const validatedKeyword = keywordInput.trim();

		navigate(`/search?keyword=${validatedKeyword}`);
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
		<div className="flex text-slate-400 w-[90%] md:max-w-[50%] self-center">
			<svg
				className="absolute self-center ml-3.5 fill-current"
				xmlns="http://www.w3.org/2000/svg"
				height="18px"
				viewBox="0 -960 960 960"
				width="18px"
				role="img"
				aria-labelledby="search-icon"
			>
				<title id="search-icon">Magnifying glass</title>
				<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
			</svg>
			<input
				className="w-full pl-[calc(18px+1.5em)] pr-6 py-3 rounded-3xl text-slate-800 bg-white border border-slate-200"
				placeholder="Search books (Title, author)"
				onKeyDown={handleKeyDown}
				onChange={handleInputChange}
				value={keywordInput}
			/>
		</div>
	);
}

export default SearchBar;
