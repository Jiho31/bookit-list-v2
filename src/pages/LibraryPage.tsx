import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import Bookshelf from '../components/Bookshelf';
import { type BookshelfItem } from '../types';
import { useBookshelf } from '../contexts/BookshelfContext';
import { useModal } from '@/contexts/ModalContext';
import { useAuth } from '@/contexts/AuthContext';
import RegisterModal from '@/components/RegisterModal';

function CreateBookshelfModal({
	createBookshelf,
	close,
}: {
	createBookshelf: (name: string) => void;
	close: () => void;
}) {
	const [nameInput, setNameInput] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNameInput(e.target.value);
	};

	const handleCreate = async () => {
		const val = nameInput.trim();
		if (val === '') {
			toast.info('Bookshelf name cannot be empty');
			return;
		}

		await createBookshelf(val);
		toast.success('Successfully created bookshelf');
		close();
	};

	return (
		<div className="flex flex-col gap-2 w-[350px] h-auto max-h-2/3 overflow-scroll bg-slate-200 p-5 rounded-2xl">
			<h2 className="text-md font-semibold py-1 mb-2">Create new bookshelf</h2>
			<label htmlFor="bookshelf-name" className="text-sm hidden">
				Name
			</label>
			<input
				id="bookshelf-name"
				className="py-2 px-3 rounded-md basis-2/3 text-sm bg-white border-slate-300"
				type="text"
				value={nameInput}
				placeholder="Type in your bookshelf name"
				onChange={handleInputChange}
			/>
			<div className="flex gap-2 mt-1.5 justify-center">
				<button onClick={handleCreate}>Create</button>
				<button
					onClick={close}
					className="bg-slate-300 text-slate-600 hover:bg-slate-400"
				>
					Cancel
				</button>
			</div>
			<button
				className="text-slate-800 bg-slate-200 absolute top-4 right-5 p-2"
				onClick={close}
			>
				X
			</button>
		</div>
	);
}

function Sidebar({ isVisible }: { isVisible: boolean }) {
	const {
		activeKey,
		setActiveKey,
		list: menuList,
		createBookshelf,
	} = useBookshelf();

	const { openModal, closeModal } = useModal();
	const { isAuthenticated } = useAuth();

	const handleCreate = async () => {
		if (isAuthenticated) {
			openModal({
				component: CreateBookshelfModal,
				props: { createBookshelf },
			});
		} else {
			openModal({ component: RegisterModal });
		}
	};

	const parsedMenuList = useMemo(() => Object.values(menuList), [menuList]);

	useEffect(() => {
		return () => closeModal();
	}, [closeModal]);

	return (
		<section
			className={`w-full ${!isVisible && 'hidden'} sm:block sm:max-w-1/4 sm:w-md h-auto sm:h-full border-b sm:border-r bg-slate-100 border-slate-200 text-slate-900`}
		>
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
									className={`w-10 shrink-0 h-6 inline-flex justify-center items-center text-sm rounded-2xl bg-slate-300  ${activeKey === data.key && 'text-amber-50 bg-slate-400'} `}
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

export default function LibraryPage() {
	const { isAuthenticated } = useAuth();
	const { activeKey, fetchBookshelf } = useBookshelf();
	const [bookshelfData, setBookshelfData] = useState<BookshelfItem | null>();
	const [isLoading, setIsLoading] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);

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

	const toggleSidebar = () => {
		setShowSidebar((prev) => !prev);
	};

	useEffect(() => {
		if (!isAuthenticated) {
			return;
		}
		handleFetchBookshelf();
	}, [activeKey]);

	return (
		<div className="w-full h-auto sm:h-dvh flex flex-col sm:flex-row">
			<Sidebar isVisible={showSidebar} />
			{isLoading && <div>Loading...</div>}
			{!!bookshelfData && !isLoading && (
				<Bookshelf
					{...(bookshelfData as BookshelfItem)}
					bookshelfKey={bookshelfData.key}
					toggleSidebar={toggleSidebar}
				/>
			)}
			{!isAuthenticated && (
				<div className="w-full h-1/2 flex flex-col items-center justify-center text-lg font-medium">
					<div className="text-4xl mb-2">📚</div>
					<div>
						<Link to="/auth" className="underline text-indigo-700">
							Sign in
						</Link>
						<span className="ml-1"> to manage your personal bookshelves!</span>
					</div>
				</div>
			)}
		</div>
	);
}
