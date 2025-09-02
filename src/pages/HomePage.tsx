import { useEffect, useMemo, useState } from 'react';
import Bookshelf from '../components/Bookshelf';
import { type BookshelfItem } from '../types';
import { useBookshelf } from '../contexts/BookshelfContext';

function Sidebar() {
	const {
		activeKey,
		setActiveKey,
		list: menuList,
		createBookshelf,
	} = useBookshelf();

	const handleCreate = () => {
		// bookshelf 정보 입력 받기 (모달 생성해서 input ?)
		// createBookshelf() 호출
	};

	const parsedMenuList = useMemo(() => Object.values(menuList), [menuList]);

	return (
		<section className="w-md max-w-1/4 h-full bg-blue-100 ">
			<div>
				<p className="px-6 py-4 font-semibold">My Bookshelves</p>
				<ul className="flex flex-col">
					{parsedMenuList?.length > 0 &&
						parsedMenuList.map((data) => (
							<li
								className={`p-4 pl-8 bg-inherit hover:bg-blue-200 hover:cursor-pointer translate-y-0 hover:transition hover:translate-y-0.5 ${activeKey === data.key && 'font-medium bg-pink-300'}`}
								key={data.key}
								id={data.key}
								onClick={() => setActiveKey(data.key)}
							>
								{data.name} ({data.numOfBooks})
							</li>
						))}
				</ul>
				<button
					type="button"
					className="w-auto ml-8 py-2 px-4 text-amber-50 bg-amber-600"
					onClick={handleCreate}
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
	const { activeKey, fetchBookshelf } = useBookshelf();
	const [bookshelfData, setBookshelfData] = useState<BookshelfItem>();

	useEffect(() => {
		fetchBookshelf(activeKey);
		console.log('rendered @@@', activeKey);

		// setBookshelfData
	}, []);

	return (
		<div className="w-full h-screen flex overflow-y-hidden">
			<Sidebar />
			{!!bookshelfData && (
				<Bookshelf
					{...bookshelfData}
					id={bookshelfData.key}
					key={bookshelfData.key}
				/>
			)}
		</div>
	);
}
