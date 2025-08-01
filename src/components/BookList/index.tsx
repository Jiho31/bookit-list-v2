import { useState } from 'react';
import type { Book } from '../../types';
import useOpenLibraryAPI from '../../hooks/useOpenLibraryAPI';
import Modal from '../common/Modal';

function BookList({ recommendations }: { recommendations: Book[] }) {
	const { getBookCoverImage } = useOpenLibraryAPI();
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const showBookDetails = (book: Book) => {
		// set scroll lock

		setSelectedBook(book);
		setIsModalOpen(true);
	};

	return (
		<>
			<section
				className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 max-w-6xl mx-auto ${isModalOpen && 'overflow-hidden'}`}
			>
				{recommendations.map((book, idx) => (
					<div
						key={idx}
						className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-103 cursor-pointer overflow-hidden max-w-xs h-90"
						onClick={() => showBookDetails(book)}
					>
						<div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
							<img
								className="w-full h-full object-cover"
								src={getBookCoverImage(book.coverEditionKey)}
								alt={`Cover of ${book.title}`}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
									const parent = target.parentElement;
									if (parent) {
										parent.innerHTML = `
															<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-amber-100 to-amber-200">
																<div class="text-center text-amber-800">
																	<div class="text-4xl mb-2">📚</div>
																	<div class="text-sm font-medium">No Cover Available</div>
																</div>
															</div>
														`;
									}
								}}
							/>
						</div>
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
								<p className="text-gray-500 text-xs mb-3">
									{book.publishedYear}
								</p>
							)}
							<button className="mt-auto bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
								Add to bookshelf
							</button>
						</div>
					</div>
				))}
			</section>
			<Modal isOpen={isModalOpen} onClose={closeModal} />
		</>
	);
}

export default BookList;
