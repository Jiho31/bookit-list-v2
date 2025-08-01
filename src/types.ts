type Book = {
	key?: string;
	author: string;
	title: string;
	coverEditionKey: string;
	publishedYear: number;
};

type Emotion =
	| 'em_happy'
	| 'em_sad'
	| 'em_angry'
	| 'em_tired'
	| 'em_confused'
	| 'em_excited'
	| 'em_relaxed';

type FictionGenre =
	| 'g_romance'
	| 'g_sf'
	| 'g_fantasy'
	| 'g_horror'
	| 'g_mystery'
	| 'g_drama'
	| 'g_humor';

type NonfictionGenre =
	| 'g_essay'
	| 'g_science'
	| 'g_history'
	| 'g_biography'
	| 'g_philosophy'
	| 'g_selfHelp';

type BookLength = 'l_short' | 'l_medium' | 'l_long';

type BookType = 't_fiction' | 't_nonfiction';

type Question = {
	id: number;
	question: string;
	options: OptionMeta[];
	priority?: number;
};

type Form = {
	[questionNo: string]: OptionMeta;
};

type OptionMeta = {
	id: Emotion | FictionGenre | NonfictionGenre | BookLength | BookType | 'any';
	label: string;
	emoji?: string;
	keywords: string[];
	queries?: string[];
};

export type { Book, Form, Question, OptionMeta };
