# Bookit List

<img width="140" height="auto" alt="Image" src="https://github.com/user-attachments/assets/a3480b24-cc11-4349-9228-c4eb0bcc3c49" />

Bookit List is a book recommendation and management system to make your reading life happier. 🤓✨

Find out what your next reads are going to be here 👉 [Live demo](https://bookit-list-v2.netlify.app/)


## Features

- Book recommendation based on a short survey of your preferences
- Personal bookshelf to save and organize books
- Search for books in a search bar

<!-- #### cf. Screenshots 📷

1. Main page / Landing page
2. Recommendation page
3. Bookshelf page -->


## Planned features
- Add notes for books saved in bookshelves

### Known issues (to be fixed)
1. For OAuth login, there is an account duplication issue.
 > When user is registered for Github using a Google account, and attempts to login using Google and Github like they're two different accounts, there will be an error.
2. Slow book cover image load time

> Book cover image loading takes long occasionally, especially when there's slow internet connection. For better user experience, this loading process can be improved (or fixed to look faster).
3. Data is unsynchronized when application is used within multiple browser tabs at the same time.

## Developed using..
- Typescript + React 19
- Tailwind CSS
- Firestore Database
- Firebase Authentication
- Sonner Toast UI
