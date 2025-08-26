import { useEffect, useState } from 'react';
import useOpenLibraryAPI from '../../hooks/useOpenLibraryAPI';
import fallbackImage from '../../assets/fallbackImage.png';

function CoverImage({
	coverEditionKey,
	title,
}: {
	coverEditionKey: string;
	title: string;
}) {
	const { getBookCoverImage } = useOpenLibraryAPI();
	const [imageStatus, setImageStatus] = useState('loading');

	useEffect(() => {
		if (
			!coverEditionKey ||
			coverEditionKey === 'undefined' ||
			coverEditionKey === 'null'
		) {
			console.log(`[${title}] Invalid cover key:`, coverEditionKey);
			setImageStatus('failed');
		}
	}, [coverEditionKey, title]);

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
		<div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
			{imageStatus === 'loading' && <div>Loading...</div>}
			<img
				className={`w-full h-full object-cover ${imageStatus === 'failed' && 'hidden'}`}
				src={getBookCoverImage(coverEditionKey)}
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
	book,
	onClickHandler,
	// isBookInBookshelf,
	// addToBookshelf,
}: {
	book: any;
	onClickHandler: () => void;
	// isBookInBookshelf: (book: any) => boolean;
	// addToBookshelf: Function;
}) {
	return (
		<div
			onClick={onClickHandler}
			className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-103 cursor-pointer overflow-hidden max-w-xs h-90"
		>
			<CoverImage coverEditionKey={book.coverEditionKey} title={book.title} />
			<div className="p-4 flex-1 flex flex-col middle min-h-0">
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
				{/* <button
					className="mt-auto bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
					disabled={isBookInBookshelf(book)}
					onClick={(e) => addToBookshelf(e, book)}
				>
					{isBookInBookshelf(book) ? 'Added' : 'Add to bookshelf'}
				</button> */}
			</div>
		</div>
	);
}
