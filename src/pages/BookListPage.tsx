import BookList from '@/components/BookList';
import useOpenLibraryAPI from '@/hooks/useOpenLibraryAPI';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

function BookListPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchResult, setSearchResult] = useState([]);
	const [keyword, setKeyword] = useState('');
	const { search } = useOpenLibraryAPI();

	const handleKeywordSearch = async () => {
		try {
			const result = await search(keyword);
			// parse data format
			/** result.docs
       {
          "author_key": [
              "OL2832500A"
          ],
          "author_name": [
              "Jeff Kinney"
          ],
          "cover_i": 7888937,
          "ebook_access": "borrowable",
          "edition_count": 52,
          "first_publish_year": 2007,
          "has_fulltext": true,
          "ia": [
              "atodamarcha0000kinn",
              "doubledown0000jeff",
              "doubledown0000kinn",
              "diaryofwimpykidd0000kinn_k3w3",
              "diaryofwimpykidd0000kinn"
          ],
          "ia_collection_s": "inlibrary;internetarchivebooks;openlibrary-d-ol;printdisabled",
          "key": "/works/OL17603394W",
          "language": [
              "eng",
              "spa",
              "wel",
              "chi",
              "baq",
              "pol",
              "jpn"
          ],
          "lending_edition_s": "OL26782251M",
          "lending_identifier_s": "atodamarcha0000kinn",
          "public_scan_b": false,
          "title": "Double Down"
        }
       */

			// setSearchResult
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const newKeyword = searchParams.get('keyword') || '';
		console.log(newKeyword, '<<<<<<<<<<<<<< keyword from params');
		setKeyword(newKeyword);
	}, [searchParams]);

	useEffect(() => {
		// 쿼리에서 키워드 가져와서 검색
		if (keyword.trim() == '') {
			return;
		}

		// @todo void 키워드 붙여야 돼?
		void handleKeywordSearch();
	}, [keyword]);
	return (
		<div>
			<BookList data={searchResult} />
		</div>
	);
}

export default BookListPage;
