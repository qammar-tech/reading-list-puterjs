/**
 * Puter KV service for persisting the reading list.
 *
 * All data is stored under a single KV key as a JSON-serialised array
 * of Book objects. This keeps the API calls minimal and simple.
 */

import type { Book, CreateBookInput, UpdateProgressInput } from "./types";

/** The key used to store the reading-list array in Puter KV. */
const STORAGE_KEY = "reading-list-v1";

/**
 * Generates a lightweight UUID-style unique identifier.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Retrieves the global `puter` object injected by Puter.js.
 * Throws if Puter.js has not been loaded yet.
 */
function getPuter(): typeof window.puter {
  if (typeof window === "undefined" || !window.puter) {
    throw new Error("Puter.js is not available");
  }
  return window.puter;
}

/**
 * Loads all books from Puter KV storage.
 * Returns an empty array when no data has been saved yet.
 */
export async function loadBooks(): Promise<Book[]> {
  const puter = getPuter();
  const raw = await puter.kv.get(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw as string) as Book[];
  } catch {
    // Corrupted data – start fresh rather than crashing.
    return [];
  }
}

/**
 * Persists the full books array to Puter KV storage.
 */
async function saveBooks(books: Book[]): Promise<void> {
  const puter = getPuter();
  await puter.kv.set(STORAGE_KEY, JSON.stringify(books));
}

/**
 * Adds a new book to the reading list and persists the change.
 * Returns the newly created Book object.
 */
export async function addBook(input: CreateBookInput): Promise<Book> {
  const books = await loadBooks();
  const newBook: Book = {
    ...input,
    id: generateId(),
    addedAt: Date.now(),
  };
  await saveBooks([...books, newBook]);
  return newBook;
}

/**
 * Updates the reading progress (currentPage + status) of an existing book.
 * Returns the updated Book, or null if the book was not found.
 */
export async function updateProgress(
  input: UpdateProgressInput
): Promise<Book | null> {
  const books = await loadBooks();
  let updatedBook: Book | null = null;

  const updatedBooks = books.map((book) => {
    if (book.id !== input.id) return book;
    updatedBook = { ...book, currentPage: input.currentPage, status: input.status };
    return updatedBook;
  });

  if (!updatedBook) return null;
  await saveBooks(updatedBooks);
  return updatedBook;
}

/**
 * Removes a book from the reading list by its id.
 */
export async function deleteBook(id: string): Promise<void> {
  const books = await loadBooks();
  await saveBooks(books.filter((book) => book.id !== id));
}
