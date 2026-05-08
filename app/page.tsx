"use client";

/**
 * Main page of the Reading List with Progress app.
 *
 * Responsibilities:
 *  - Bootstrap Puter.js on the client side.
 *  - Handle authentication state.
 *  - Load / persist books via the Puter KV service.
 *  - Compose all UI components into a single-page experience.
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import Script from "next/script";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthScreen } from "@/components/auth-screen";
import { BookCard } from "@/components/book-card";
import { AddBookDialog } from "@/components/add-book-dialog";
import { UpdateProgressDialog } from "@/components/update-progress-dialog";
import { FilterTabs } from "@/components/filter-tabs";
import { EmptyState } from "@/components/empty-state";
import {
  loadBooks,
  addBook,
  updateProgress,
  deleteBook,
} from "@/lib/puter-service";
import type {
  Book,
  CreateBookInput,
  FilterOption,
  UpdateProgressInput,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AppState = "loading" | "unauthenticated" | "authenticated";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [username, setUsername] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isBooksLoading, setIsBooksLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isPuterReady, setIsPuterReady] = useState(false);

  // -------------------------------------------------------------------------
  // Bootstrap – run once Puter.js is loaded
  // -------------------------------------------------------------------------

  const initializePuter = useCallback(async () => {
    try {
      const isSignedIn = window.puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await window.puter.auth.getUser();
        setUsername(user.username);
        setAppState("authenticated");
        await fetchBooks();
      } else {
        setAppState("unauthenticated");
      }
    } catch {
      // If Puter is unavailable fall back to unauthenticated view.
      setAppState("unauthenticated");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isPuterReady) {
      initializePuter();
    }
  }, [isPuterReady, initializePuter]);

  // -------------------------------------------------------------------------
  // Data helpers
  // -------------------------------------------------------------------------

  async function fetchBooks(): Promise<void> {
    setIsBooksLoading(true);
    try {
      const data = await loadBooks();
      // Show most-recently-added books first.
      setBooks(data.sort((a, b) => b.addedAt - a.addedAt));
    } finally {
      setIsBooksLoading(false);
    }
  }

  // -------------------------------------------------------------------------
  // Auth actions
  // -------------------------------------------------------------------------

  async function handleSignIn(): Promise<void> {
    setAppState("loading");
    try {
      const user = await window.puter.auth.signIn();
      setUsername(user.username);
      setAppState("authenticated");
      await fetchBooks();
    } catch {
      setAppState("unauthenticated");
    }
  }

  async function handleSignOut(): Promise<void> {
    await window.puter.auth.signOut();
    setBooks([]);
    setUsername("");
    setAppState("unauthenticated");
  }

  // -------------------------------------------------------------------------
  // Book CRUD actions
  // -------------------------------------------------------------------------

  async function handleAddBook(input: CreateBookInput): Promise<void> {
    const newBook = await addBook(input);
    setBooks((prev) => [newBook, ...prev]);
  }

  async function handleUpdateProgress(input: UpdateProgressInput): Promise<void> {
    const updated = await updateProgress(input);
    if (!updated) return;
    setBooks((prev) =>
      prev.map((book) => (book.id === updated.id ? updated : book))
    );
  }

  async function handleDeleteBook(id: string): Promise<void> {
    await deleteBook(id);
    setBooks((prev) => prev.filter((book) => book.id !== id));
  }

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------

  const filteredBooks = useMemo(
    () =>
      activeFilter === "all"
        ? books
        : books.filter((book) => book.status === activeFilter),
    [books, activeFilter]
  );

  const counts = useMemo<Record<FilterOption, number>>(
    () => ({
      all: books.length,
      reading: books.filter((b) => b.status === "reading").length,
      "to-read": books.filter((b) => b.status === "to-read").length,
      finished: books.filter((b) => b.status === "finished").length,
    }),
    [books]
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  // Load Puter.js via next/script so it runs after hydration.
  const puterScript = (
    <Script
      src="https://js.puter.com/v2/"
      strategy="afterInteractive"
      onLoad={() => setIsPuterReady(true)}
    />
  );

  if (appState === "loading") {
    return (
      <>
        {puterScript}
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (appState === "unauthenticated") {
    return (
      <>
        {puterScript}
        <AuthScreen onSignIn={handleSignIn} isLoading={false} />
      </>
    );
  }

  return (
    <>
      {puterScript}

      <div className="flex min-h-screen flex-col bg-background">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm tracking-tight">
                Reading List
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:block">
                {username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Main content                                                     */}
        {/* ---------------------------------------------------------------- */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
          {/* Toolbar: filter tabs + add button */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterTabs
              activeFilter={activeFilter}
              counts={counts}
              onFilterChange={setActiveFilter}
            />
            <AddBookDialog onAdd={handleAddBook} />
          </div>

          {/* Section heading */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {activeFilter === "all"
                ? "All books"
                : activeFilter === "reading"
                ? "Currently reading"
                : activeFilter === "to-read"
                ? "Want to read"
                : "Finished"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
            </p>
          </div>

          {/* Book grid or empty state */}
          {isBooksLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-foreground" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <EmptyState filter={activeFilter} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onUpdateProgress={setSelectedBook}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          )}
        </main>

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                           */}
        {/* ---------------------------------------------------------------- */}
        <footer className="border-t border-border/60 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://developer.puter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Puter
            </a>
          </p>
        </footer>
      </div>

      {/* Update progress dialog (rendered outside the grid for z-index cleanliness) */}
      <UpdateProgressDialog
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onSave={handleUpdateProgress}
      />
    </>
  );
}
