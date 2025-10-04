import { useState } from 'react';
import useOpenLibraryAPI from '@/hooks/useOpenLibraryAPI';

function SearchBar() {
	const [keywordInput, setKeywordInput] = useState('');
	const { search } = useOpenLibraryAPI();

	const handleBookSearch = async () => {
		console.log('####Search :', keywordInput);

		try {
			const result = await search(keywordInput, 50);
			console.log(result, '########### RESULT ');
		} catch (err) {
			console.error(err);
		}

		// keyword 값 검증 ??

		// 1. url 쿼리에 keyword 저장
		// 2. page 검색 결과 페이지로 라우팅
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') {
			return;
		}
		handleBookSearch();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// @todo add throttling ?

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
