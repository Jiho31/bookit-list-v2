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
		const nameInput = (await prompt('Type in the name of bookshelf')) || '';
		if (nameInput.length > 0) {
			await createBookshelf(nameInput);
		}
	};

	const parsedMenuList = useMemo(() => Object.values(menuList), [menuList]);

	return (
		<section className="w-md max-w-1/4 h-full border-r bg-slate-100 border-slate-200 text-slate-900">
			<div>
				<p className="px-6 py-4 font-semibold">My Bookshelves</p>
				<ul className="flex flex-col">
					{parsedMenuList?.length > 0 &&
						parsedMenuList.map((data) => (
							<li
								className={`flex justify-between items-center p-4 pl-8 hover:bg-indigo-100 hover:cursor-pointer hover:scale-101 ${activeKey === data.key && 'font-medium bg-indigo-200'}`}
								key={data.key}
								id={data.key}
								onClick={() => setActiveKey(data.key)}
							>
								<span>{data.name}</span>
								<span
									className={`w-10 h-6 inline-flex justify-center items-center text-sm rounded-2xl bg-slate-300  ${activeKey === data.key && 'text-amber-50 bg-slate-400'} `}
								>
									{data.numOfBooks}
								</span>
							</li>
						))}
				</ul>
				<button
					type="button"
					className="my-3 ml-8 text-sm"
					onClick={handleCreate}
				>
					+ New Bookshelf
				</button>
			</div>
			<div className="mx-auto my-2 w-full h-[1px] bg-slate-200 block"></div>
			<div>
				<p className="px-6 py-4 font-semibold">My Notes</p>
				<ul className="flex flex-col">
					<li
						className={`flex justify-between items-center p-4 pl-8 hover:bg-indigo-100 hover:cursor-pointer hover:scale-101 `}
					>
						Recent Notes
					</li>
					<li
						className={`flex justify-between items-center p-4 pl-8 hover:bg-indigo-100 hover:cursor-pointer hover:scale-101 `}
					>
						Favorites ⭐️
					</li>
				</ul>
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
		<div className="w-full h-dvh flex">
			<Sidebar />
			{isLoading && <div>Loading...</div>}
			{!!bookshelfData && !isLoading && (
				<Bookshelf
					{...(bookshelfData as BookshelfItem)}
					bookshelfKey={bookshelfData.key}
				/>
			)}
		</div>
	);
}
