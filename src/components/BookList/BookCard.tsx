import { useQuery } from '@tanstack/react-query';
import useOpenLibraryAPI from '../../hooks/useOpenLibraryAPI';
import type { Book, BookItem, CardButton } from '../../types';
import fallbackImage from '../../assets/fallbackImage.png';
import LoadingSpinner from '../common/LoadingSpinner';

function CoverImage({
	coverEditionKey,
	coverId,
	title,
}: {
	coverEditionKey: string | undefined;
	coverId: number | undefined;
	title: string;
}) {
	const { fetchCoverImage } = useOpenLibraryAPI();

	const {
		isPending,
		isError,
		data: imageUrl,
	} = useQuery({
		queryKey: ['coverImage', coverEditionKey, coverId],
		queryFn: () => fetchCoverImage({ key: coverEditionKey, id: coverId }),
		enabled: !!(coverEditionKey || coverId),
	});

	if (isPending) {
		return <LoadingSpinner width={36} height={36} />;
	}

	if (isError) {
		return (
			<div className="relative w-full min-w-full h-48 min-h-48 bg-gray-100 flex items-center justify-center">
				<img
					className="w-full h-full object-cover"
					src={fallbackImage}
					alt="Fallback cover"
				/>
			</div>
		);
	}

	return (
		<div className="relative w-full min-w-full h-48 min-h-48 bg-gray-100 flex items-center justify-center">
			<img
				className="w-full h-full object-cover"
				src={imageUrl}
				alt={`Cover of ${title}`}
			/>
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
	book: Book;
	onClickHandler?: () => void;
	buttons: CardButton[];
}) {
	return (
		<div
			onClick={onClickHandler}
			className="flex flex-row md:flex-col bg-white rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 hover:scale-103 overflow-hidden w-full h-auto min-w-64 sm:min-w-56"
		>
			<div className="w-1/2 md:w-full h-32 sm:h-48">
				<CoverImage
					coverEditionKey={book.coverEditionKey}
					coverId={book.coverId}
					title={book.title}
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
