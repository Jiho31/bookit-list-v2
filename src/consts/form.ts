import type { OptionMeta, Question } from '../types';

const emotionOptions: OptionMeta[] = [
	{
		id: 'em_happy',
		label: 'Happy',
		emoji: '☺️',
		keywords: ['happy', 'comedy', 'romance', 'adventure', 'feel-good'],
	},
	{
		id: 'em_sad',
		label: 'Sad',
		emoji: '😔',
		keywords: ['drama', 'coming of age', 'healing', 'emotional'],
	},
	{
		id: 'em_angry',
		label: 'Angry',
		emoji: '😤',
		keywords: ['thriller', 'justice', 'revenge', 'dark fantasy', 'political'],
	},
	{
		id: 'em_relaxed', // relaxed
		label: 'Relaxed',
		emoji: '😌',
		keywords: ['Nature', 'Travel', 'Essay'],
	},
	{
		id: 'em_tired',
		label: 'Tired',
		emoji: '😴',
		keywords: ['Short stories', 'Easy read', 'Humor', 'Light'],
	},
	{
		id: 'em_confused',
		label: 'Confused',
		emoji: '🤯',
		keywords: ['Mystery', 'Scifi', 'Psychological'],
	},
	{
		id: 'em_excited',
		label: 'Excited',
		emoji: '🤩',
		keywords: [
			'Fantasy',
			'Adventure',
			'Romance',
			'romantic',
			'romantic comedy',
			'Hopeful',
		],
	},
];

const bookTypeOptions: OptionMeta[] = [
	{
		id: 't_fiction',
		label: 'Story-driven (fiction)',
		keywords: [
			/* 'fiction' */
		],
		queries: ['subject_key:fiction', '-subject_key:nonfiction'],
	},
	{
		id: 't_nonfiction',
		label: 'Information-based (non-fiction)',
		keywords: [
			/* 'nonfiction' */
		],
		queries: ['subject_key:nonfiction', '-subject_key:fiction'],
	},
	{
		id: 'any',
		label: "I don't mind",
		keywords: [],
	},
];

const bookLengthOptions: OptionMeta[] = [
	{
		id: 'l_short',
		label: 'Short (Under 150 pages)',
		keywords: [], // page 쪽수로 쿼리 만들기
		queries: ['number_of_pages:[1 TO 150]'],
	},
	{
		id: 'l_medium',
		label: 'Medium (150-350 pages)',
		keywords: [],
		queries: ['number_of_pages:[150 TO 350]'],
	},
	{
		id: 'l_long',
		label: 'Long (Over 350 pages)',
		keywords: [],
		queries: ['number_of_pages:[350 TO *]'],
	},
	{
		id: 'any',
		label: "I don't mind",
		keywords: [],
		queries: [],
	},
];

const genreOptions: OptionMeta[] = [
	{
		id: 'g_biography',
		label: 'Biography',
		keywords: ['biography'],
	},
	{
		id: 'g_drama',
		label: 'Drama',
		keywords: ['drama'],
	},
];

const questions: Question[] = [
	{
		id: 1,
		question: '🫥 How are you feeling today?',
		options: emotionOptions,
		// options: ['Happy', 'Sad', 'Angry'],
	},
	{
		id: 2,
		question: '📖 Would you like something more narrative or more informative?',
		options: bookTypeOptions,
	},
	{
		id: 3,
		question: '📏 How long of a book would you prefer?',
		options: bookLengthOptions,
	},
	/* {
    id: 4,
    question: '📚 What kind of stories are you in the mood for?',
    options: genreOptions, // @todo 2번 문제 선택에 따라 4번 문제 option 선택지가 달라짐
  }, */
];

export { questions };
