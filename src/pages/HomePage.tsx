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

	const handleCreate = async () => {
		// @todo bookshelf name 입력 받기 (모달 생성해서 input ?)
		await createBookshelf('New Bookshelf');
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
	const [bookshelfData, setBookshelfData] = useState<BookshelfItem | null>();
	const [isLoading, setIsLoading] = useState(false);

	const handleFetchBookshelf = async () => {
		setIsLoading(true);
		try {
			const newBookshelfData = await fetchBookshelf(activeKey);

			setBookshelfData(newBookshelfData);
		} catch (error) {
			console.error('Error fetching bookshelf:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		handleFetchBookshelf();
	}, [activeKey]);

	return (
		<div className="w-full h-screen flex overflow-y-hidden">
			<Sidebar />
			{isLoading && <div>Loading...</div>}
			{!!bookshelfData && !isLoading && (
				<Bookshelf
					{...(bookshelfData as BookshelfItem)}
					key={bookshelfData.key}
				/>
			)}
		</div>
	);
}
