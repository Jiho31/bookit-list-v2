import { useMemo, useState } from 'react';
import type { Book, BookItem, CardButton } from '../../types';
import fallbackImage from '../../assets/fallbackImage.png';
import LoadingSpinner from '../common/LoadingSpinner';

function CoverImage({ title, imgUrl }: { title: string; imgUrl: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	if (isError) {
		return <img className="w-full h-full object-cover" src={fallbackImage} />;
	}

	return (
		<>
			{isLoading && <LoadingSpinner width={36} height={36} />}
			<img
				className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
				src={imgUrl}
				onError={() => setIsError(true)}
				onLoad={() => setIsLoading(false)}
				loading="lazy"
				alt={`Cover of ${title}`}
			/>
		</>
	);
}

export default function BookCard({
	data,
	book,
	onClickHandler,
	buttons,
}: {
	data?: BookItem;
	book: Book;
	onClickHandler?: () => void;
	buttons: CardButton[];
}) {
	const imgUrl = useMemo(() => {
		if (typeof book.coverId === 'number') {
			return `https://covers.openlibrary.org/b/id/${book.coverId}.jpg?default=false`;
		} else if (typeof book.coverEditionKey === 'string') {
			return `https://covers.openlibrary.org/b/olid/${coverEditionKey}.jpg?default=false`;
		} else {
			return '';
		}
	}, [book]);

	const hasValidCoverImage = useMemo(() => imgUrl !== '', [imgUrl]);

	return (
		<div
			onClick={onClickHandler}
			className="flex flex-row md:flex-col bg-white rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 hover:scale-103 overflow-hidden w-auto md:w-[350px] lg:w-[300px] h-48 md:h-auto"
		>
			<div className="aspect-3/4 w-[250px] md:w-full h-auto sm:h-48 bg-slate-100">
				{hasValidCoverImage ? (
					<CoverImage imgUrl={imgUrl} title={book.title} />
				) : (
					<img className="w-full h-full object-cover" src={fallbackImage} />
				)}
			</div>
			<div className="p-4 w-[300px] md:w-full flex flex-col justify-evenly">
				<div className="relative group">
					<h3
						className="font-bold text-md mb-2 text-gray-800 line-clamp-1"
						title={book.title}
					>
						{book.title}
					</h3>
				</div>
				<div className="relative group">
					<p
						className="text-gray-600 mb-3 text-sm line-clamp-1"
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
								onClick={(e) => b.onClickHandler({ e, data, book })}
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
