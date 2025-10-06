import BookList from '@/components/BookList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import useOpenLibraryAPI from '@/hooks/useOpenLibraryAPI';
import {
	type Book,
	// type OpenLibrarySearchResponse,
	type SearchResultDocs,
} from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

type SearchInfo = {
	data: Book[];
	total: number;
	pageIndex: number;
	pageSize: number;
};

const PAGE_SIZE = 30;

function BookListPage() {
	const [searchParams /* , setSearchParams */] = useSearchParams();
	const [searchResult, setSearchResult] = useState<SearchInfo | undefined>({});
	const [keyword, setKeyword] = useState('');
	const [data, setData] = useState<Book[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { searchByKeyword } = useOpenLibraryAPI();
	const isEmpty = useMemo(() => data.length === 0, [data]);

	const handleKeywordSearch = async (filteredKeyword: string) => {
		try {
			setIsLoading(true);

			const result = await searchByKeyword(filteredKeyword);
			// console.log(result, '1111111111 search RESULT');

			const parsedData =
				result?.docs.map((origin: SearchResultDocs) => ({
					key: origin.key,
					author:
						typeof origin.author_name == 'object'
							? origin.author_name[0]
							: 'Unknown',
					title: origin.title,
					coverEditionKey: origin.cover_edition_key,
					coverId: origin.cover_i,
					publishedYear: origin.first_publish_year,
				})) || [];

			setSearchResult({
				pageIndex: 0,
				pageSize: 30,
				data: parsedData,
				total: result?.numFound || 0,
			});

			console.log(parsedData, '##### PARSED');

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

			setData(parsedData.slice(0, PAGE_SIZE));
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const newKeyword = searchParams.get('keyword') || '';

		// @todo 영어 아닌 언어 입력하면 어떻게 되지..? 예외 처리 필요한가

		setKeyword(newKeyword);
	}, [searchParams]);

	useEffect(() => {
		// @todo keyword reg test
		const filteredKeyword = keyword.trim();
		if (filteredKeyword == '') {
			return;
		}

		void handleKeywordSearch(filteredKeyword);
	}, [keyword]);
	return (
		<section className="w-full h-full px-8 flex flex-col justify-center align-middle">
			<h1 className="text-center py-8 font-semibold text-2xl">
				Search results for '{keyword}':
			</h1>
			{isLoading ? (
				<div className="w-full h-full m-auto">
					<LoadingSpinner width={48} height={48} />
					<p className="text-center">Loading results ...</p>
				</div>
			) : !isEmpty ? (
				<BookList data={data} />
			) : (
				<div className="text-center text-gray-500 py-10">
					No result can be found.
				</div>
			)}
		</section>
	);
}

export default BookListPage;
