import { useEffect, useState } from 'react';
import Bookshelf from '../components/Bookshelf';
import { type BookshelfItem } from '../types';
import { DEFAULT_BOOKSHELF_ITEM, DEFAULT_BOOKSHELF_KEY } from '../consts/books';

function Sidebar({
	activeKey,
	setActiveBookshelf,
}: {
	activeKey: string;
	setActiveBookshelf: (key: string) => void;
}) {
	const [menuList, setMenuList] = useState([]);

	useEffect(() => {
		// 1. bookshelf의 메타 정보 GET api 호출
		// 2. 응답값 파싱
		// 3. setMenuList
	});

	const mock = [
		DEFAULT_BOOKSHELF_ITEM,
		{
			name: 'Want to Read 🌟',
			key: '2',
			// books: [],
			createdAt: new Date('2025-08-02'),
			updatedAt: new Date('2025-08-02'),
			numOfBooks: 0,
		},
	];

	return (
		<section className="w-md max-w-1/4 h-full bg-blue-100 ">
			<div>
				<p className="px-6 py-4 font-semibold">My Bookshelves</p>
				<ul className="flex flex-col">
					{mock.map((data) => (
						<li
							className={`p-4 pl-8 bg-inherit hover:bg-blue-200 hover:cursor-pointer translate-y-0 hover:transition hover:translate-y-0.5 ${activeKey === data.key && 'font-medium bg-pink-300'}`}
							key={data.key}
							onClick={() => setActiveBookshelf(data.key)}
						>
							{data.name} ({data.numOfBooks})
						</li>
					))}
				</ul>
				<button
					type="button"
					className="w-auto ml-8 py-2 px-4 text-amber-50 bg-amber-600"
				>
					New Bookshelf
				</button>
			</div>
			<div>
				<p className="px-6 py-4 font-semibold">My Notes</p>
			</div>
		</section>
	);
}

export default function HomePage() {
	const [activeBookshelf, setActiveBookshelf] = useState<string>(
		DEFAULT_BOOKSHELF_KEY,
	);
	const [bookshelfData, setBookshelfData] = useState<BookshelfItem>();

	useEffect(() => {
		(async () => {
			try {
				// 1. activeBookshelf key 기준으로 bookshelf 데이터 GET api 호출
				// --> 일단 mock 넣자
				const mock = await Promise.resolve(DEFAULT_BOOKSHELF_ITEM);
				console.log(mock, '### pretend fetched data');

				setBookshelfData(mock);
			} catch (err) {
				console.error(err);
			}
		})();
	}, [activeBookshelf]);

	return (
		<div className="w-full h-full flex overflow-y-hidden">
			<Sidebar
				activeKey={activeBookshelf}
				setActiveBookshelf={setActiveBookshelf}
			/>
			{!!bookshelfData && (
				<Bookshelf
					key={bookshelfData.key}
					name={bookshelfData.name}
					books={bookshelfData.books}
				/>
			)}
		</div>
	);
}
