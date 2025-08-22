import type { BookshelfItem } from '../types';

const DEFAULT_BOOKSHELF_KEY = 'default_bookshelf_key';

const DEFAULT_BOOKSHELF_ITEM: BookshelfItem = {
	key: DEFAULT_BOOKSHELF_KEY,
	name: 'To Read 📚',
	books: [],
	createdAt: undefined,
	updatedAt: undefined,
};

export { DEFAULT_BOOKSHELF_KEY, DEFAULT_BOOKSHELF_ITEM };
