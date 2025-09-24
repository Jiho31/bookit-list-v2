import { useEffect, useState } from 'react';
import useOpenLibraryAPI from '../../hooks/useOpenLibraryAPI';
import fallbackImage from '../../assets/fallbackImage.png';
import type { BookItem, CardButton } from '../../types';

function CoverImage({
	coverEditionKey,
	coverId,
	title,
	// setIsLoading,
}: {
	coverEditionKey: string | null;
	coverId: number | null;
	title: string;
	// setIsLoading: Function;
}) {
	const { getBookCoverImage } = useOpenLibraryAPI();
	const [imageStatus, setImageStatus] = useState('loading');

	useEffect(() => {
		// setIsLoading(true);
		if (!coverId) {
			console.log(`[${title}] Invalid cover id:`, coverId);
			setImageStatus('failed');
		}
	}, [coverId, title]);

	const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.target as HTMLImageElement;

		// If image is too small, treat as failed
		if (img.naturalWidth < 50 || img.naturalHeight < 50) {
			setImageStatus('failed');
		} else {
			setImageStatus('loaded');
		}
	};

	return (
		<div className="relative w-full min-w-full h-48 min-h-48 bg-gray-100 flex items-center justify-center">
			{imageStatus === 'loading' && <div>Loading...</div>}
			<img
				className={`w-full h-full object-cover ${imageStatus === 'failed' && 'hidden'}`}
				src={getBookCoverImage({ key: coverEditionKey, id: coverId })}
				alt={`Cover of ${title}`}
				onLoad={handleImageLoad}
				onError={() => setImageStatus('failed')}
			/>
			{imageStatus === 'failed' && (
				<img className="w-full h-full object-cover" src={fallbackImage} />
			)}
		</div>
	);
}

export default function BookCard({
	data,
	book,
	onClickHandler,
	buttons,
}: {
	data?: BookItem;
	book: any;
	onClickHandler?: () => void;
	buttons: CardButton[];
}) {
	// @todo add loader

	// useEffect(() => {
	// 	console.log(data, book, book.length, '<<<<<<<<<< book data in [BookCard]');

	// 	// if book is not empty, load Book component
	// 	// else, show loading
	// 	// toast('hi');
	// }, [book]);

	return (
		<div
			onClick={onClickHandler}
			className="flex flex-row md:flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-103 overflow-hidden w-full h-auto min-w-64 sm:min-w-64"
		>
			<div className="w-1/2 md:w-full h-32 sm:h-48">
				<CoverImage
					coverEditionKey={book.coverEditionKey}
					coverId={book.coverId}
					title={book.title}
					// setIsLoading={setIsLoading}
				/>
			</div>
			<div className="p-4 w-1/2 md:w-full flex flex-col">
				<div className="relative group">
					<h3
						className="font-bold text-md mb-2 text-gray-800 truncate"
						title={book.title}
					>
						{book.title}
					</h3>
				</div>
				<div className="relative group">
					<p
						className="text-gray-600 mb-3 text-sm truncate"
						title={book.author}
					>
						{book.author}
					</p>
				</div>
				{book.publishedYear && (
					<p className="text-gray-500 text-xs mb-3">{book.publishedYear}</p>
				)}
				<div className="w-full flex flex-row gap-1">
					{buttons.length > 0 &&
						buttons.map((b: CardButton, idx) => (
							<button
								key={idx}
								type="button"
								onClick={(e) => b.onClickHandler(e, { data, book })}
								className="text-sm flex-1/2 inline-flex justify-center items-center gap-2"
							>
								{b.icon !== undefined ? b.icon : null}
								{b.label}
							</button>
						))}
				</div>
			</div>
		</div>
	);
}
