import type { BookshelfItem } from '../types';

const DEFAULT_BOOKSHELF_KEY = 'default_bookshelf_key';
const BOOKSHELF_LIST_KEY = 'bookshelf_list_key';

const books = [
	{
		key: 'OL1M',
		author: 'George Orwell',
		title: '1984',
		coverEditionKey: 'OL12345M',
		publishedYear: 1949,
	},
	{
		key: 'OL2M',
		author: 'Harper Lee',
		title: 'To Kill a Mockingbird',
		coverEditionKey: 'OL67890M',
		publishedYear: 1960,
	},
	{
		key: 'OL3M',
		author: 'J.R.R. Tolkien',
		title: 'The Hobbit',
		coverEditionKey: 'OL13579M',
		publishedYear: 1937,
	},
	{
		key: 'OL4M',
		author: 'Mary Shelley',
		title: 'Frankenstein',
		coverEditionKey: 'OL24680M',
		publishedYear: 1818,
	},
	{
		key: 'OL5M',
		author: 'F. Scott Fitzgerald',
		title: 'The Great Gatsby',
		coverEditionKey: 'OL11223M',
		publishedYear: 1925,
	},
];

const now = new Date().toISOString();

const bookItemsMock = books.map((b, i) => ({
	id: `book-item-${i + 1}`,
	book: b,
	createdAt: now,
	updatedAt: now,
}));

const DEFAULT_BOOKSHELF_ITEM: BookshelfItem = {
	key: DEFAULT_BOOKSHELF_KEY,
	name: 'To Read 📚',
	books: [], // bookItemsMock
	numOfBooks: 0,
	createdAt: undefined,
	updatedAt: undefined,
};

export {
	DEFAULT_BOOKSHELF_KEY,
	BOOKSHELF_LIST_KEY,
	DEFAULT_BOOKSHELF_ITEM,
	bookItemsMock,
};
