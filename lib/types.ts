/**
 * Reading status for a book entry.
 */
export type ReadingStatus = "to-read" | "reading" | "finished";

/**
 * A single book entry in the reading list.
 */
export interface Book {
  /** Unique identifier (UUID) */
  readonly id: string;
  /** Book title */
  title: string;
  /** Author name */
  author: string;
  /** Total number of pages */
  totalPages: number;
  /** Page the user is currently on */
  currentPage: number;
  /** Current reading status */
  status: ReadingStatus;
  /** Unix timestamp (ms) when the book was added */
  addedAt: number;
}

/**
 * Payload for creating a new book (no id / timestamps needed).
 */
export type CreateBookInput = Omit<Book, "id" | "addedAt">;

/**
 * Payload for updating an existing book's progress.
 */
export interface UpdateProgressInput {
  id: string;
  currentPage: number;
  status: ReadingStatus;
}

/**
 * Filter options for the reading list view.
 */
export type FilterOption = "all" | ReadingStatus;
