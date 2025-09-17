import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDB } from '../plugins/fbase';

// Creates a bookshelf document under users/{uid}/bookshelves/{key}
// If key is not provided, caller should generate one.
async function createBookshelfForUser(params: {
	uid: string;
	key: string;
	name: string;
}) {
	const { uid, key, name } = params;

	const shelfRef = doc(firebaseDB, 'users', uid, 'bookshelves', key);
	await setDoc(shelfRef, {
		key,
		name,
		books: [],
		numOfBooks: 0,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});
}

export { createBookshelfForUser };
