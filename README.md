# Notepad Application

This is a simple Notepad application built with Vue.js and Node.js, using MongoDB as the database. The application supports creating, reading, and deleting notes, with dark mode support.

## Features

- Create, read, and delete notes
- Dark mode support
- Search notes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/rbshah29/notepad.git
cd notepad
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Create a `.env` file in the root directory and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

### 4. Run the application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
notepad/
├── components/
│   ├── AddNoteModal.vue
│   └── NoteCard.vue
├── pages/
│   └── index.vue
├── server/
│   ├── api/
│   │   └── notes.js
│   └── utils/
│       └── mongodb.js
├── .env
├── package.json
└── README.md
```

## API Endpoints

### GET /api/notes

Fetch all notes.

### POST /api/notes

Add a new note.

### DELETE /api/notes

Delete a note by ID. Requires `id` query parameter.

## Usage

### Adding a Note

1. Click the "+" button to open the Add Note modal.
2. Enter the title and content of the note.
3. Click "Save" to add the note.

### Deleting a Note

1. Click the delete button on the note card.
2. The note will be deleted from the database.

### Searching Notes

1. Enter a search query in the search input.
2. The notes will be filtered based on the query.

## License

This project is licensed under the MIT License.
