import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import type { Book, CardButton, SearchMetaInfo } from '@/types';
import BookCard from './BookCard';
import { useModal } from '../../contexts/ModalContext';
import { useAuth } from '@/contexts/AuthContext';
import RegisterModal from '../RegisterModal';
import LoadingSpinner from '../common/LoadingSpinner';
import BookshelfListModal from './BookshelfListModal';

function BookList({
	data,
	fetchData,
	metaInfo,
	isLoading,
	loadingContent = 'Loading ...',
	emptyContent,
}: {
	data: Book[];
	fetchData: ({ page }: { page: number }) => Promise<void>;
	metaInfo: SearchMetaInfo;
	isLoading: boolean;
	loadingContent?: string;
	emptyContent?: ReactElement;
}) {
	const { openModal, closeModal } = useModal();
	const { isAuthenticated } = useAuth();
	const isEmpty = useMemo(() => data.length === 0, [data]);
	const [page, setPage] = useState(1);
	const observerRef = useRef(null);
	const maxContendLoaded = useMemo(
		() => page >= Math.ceil(metaInfo.total / metaInfo.pageSize),
		[page, metaInfo],
	);

	useEffect(() => {
		if (isLoading) {
			// console.log('3333333 Data is still loading');
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// console.log('####### observed!!!!!!');

					if (maxContendLoaded) {
						// console.log('222222222222 Max loaded !222222');

						return;
					}
					setPage((prevPage) => {
						const nextPage = prevPage + 1;
						void fetchData({ page: nextPage });
						return nextPage;
					});
				}
			},
			{
				threshold: 1,
				rootMargin: '20px',
			},
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [isLoading, maxContendLoaded, fetchData, observerRef]);

	const handleAddBook = ({
		e,
		book,
	}: {
		e: React.MouseEvent<HTMLButtonElement>;
		book: Book;
	}) => {
		e.stopPropagation();

		if (isAuthenticated) {
			openModal({ component: BookshelfListModal, props: { book } });
		} else {
			openModal({ component: RegisterModal });
		}
	};

	const buttons: CardButton[] = [
		{
			label: 'Add to bookshelf',
			onClickHandler: handleAddBook,
			icon: (
				<svg
					role="img"
					aria-labelledby="add-bookmark-button"
					className="fill-current"
					xmlns="http://www.w3.org/2000/svg"
					height="20px"
					viewBox="0 -960 960 960"
					width="20px"
				>
					<title id="add-bookmark-button">Add book</title>
					<path d="M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
				</svg>
			),
		},
	];

	useEffect(() => {
		return () => closeModal();
	}, [closeModal]);

	return (
		<>
			{isEmpty ? (
				<div className="text-center text-gray-500 py-10">{emptyContent}</div>
			) : (
				<section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-full sm:max-w-4xl mx-auto">
					{data.map((book) => (
						<BookCard key={book.key} book={book} buttons={buttons} />
					))}
				</section>
			)}
			<div ref={observerRef}></div>
			{isLoading && (
				<div className="w-full h-full m-auto">
					<LoadingSpinner width={48} height={48} />
					<p className="text-center">{loadingContent}</p>
				</div>
			)}
		</>
	);
}

export default BookList;
