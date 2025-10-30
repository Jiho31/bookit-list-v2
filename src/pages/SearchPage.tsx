import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { Book, SearchMetaInfo, SearchResultDocs } from '@/types';
import useOpenLibraryAPI from '@/hooks/useOpenLibraryAPI';
import BookList from '@/components/BookList';
import SearchBar from '@/components/SearchBar';

const PAGE_SIZE = 30;
// @todo meta 정보 저장 필요할까??
const defaultMeta: SearchMetaInfo = {
	total: 0,
	pageIndex: 1,
	pageSize: PAGE_SIZE,
};

function SearchPage() {
	const [searchParams /* , setSearchParams */] = useSearchParams();
	const [keyword, setKeyword] = useState('');
	const [data, setData] = useState<Book[]>([]);
	const [metaInfo, setMetaInfo] = useState<SearchMetaInfo>(defaultMeta);
	const [isLoading, setIsLoading] = useState(false);
	const filteredKeyword = useMemo(() => keyword.trim(), [keyword]);
	const { searchByKeyword } = useOpenLibraryAPI();

	const emptyContent = <>'No results can be found.'</>;

	const fetchData = async ({
		page,
		isInit = false,
	}: {
		page: number;
		isInit?: boolean;
	}) => {
		try {
			setIsLoading(true);
			const result = await searchByKeyword({
				keyword: filteredKeyword,
				limit: PAGE_SIZE,
				page,
			});
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

			// console.log(parsedData, '##### PARSED');

			if (isInit) {
				setData(parsedData);
			} else {
				setData([...data, ...parsedData]);
			}

			setMetaInfo((prev: SearchMetaInfo) => ({
				...prev,
				total: result?.numFound || 0,
			}));
		} catch (err) {
			console.error(err);
			toast.error('Failed to fetch data');
		} finally {
			setIsLoading(false);
		}
	};

	const init = () => {
		void fetchData({ page: 1, isInit: true });
	};

	useEffect(() => {
		const newKeyword = searchParams.get('keyword') || '';

		// @todo 영어 아닌 언어 입력하면 어떻게 되지..? 예외 처리 필요한가

		setKeyword(newKeyword);
	}, [searchParams]);

	useEffect(() => {
		if (filteredKeyword == '') {
			return;
		}

		init();
	}, [filteredKeyword]);

	return (
		<section className="w-full h-full p-3 md:p-8 flex flex-col gap-6 justify-center align-middle">
			<SearchBar />
			<h1 className="text-center font-semibold text-2xl">
				Search results for '{keyword}':
			</h1>
			<BookList
				data={data}
				metaInfo={metaInfo}
				enableInfiniteScroll={true}
				fetchData={fetchData}
				isLoading={isLoading}
				emptyContent={emptyContent}
			/>
		</section>
	);
}

export default SearchPage;
