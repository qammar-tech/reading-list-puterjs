"use client";

import { Trash2, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Book, ReadingStatus } from "@/lib/types";

interface BookCardProps {
  book: Book;
  onUpdateProgress: (book: Book) => void;
  onDelete: (id: string) => void;
}

/** Visual configuration for each reading status. */
const STATUS_CONFIG: Record<
  ReadingStatus,
  { label: string; icon: React.ReactNode; badgeClass: string }
> = {
  "to-read": {
    label: "To Read",
    icon: <Clock className="h-3 w-3" />,
    badgeClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  reading: {
    label: "Reading",
    icon: <BookOpen className="h-3 w-3" />,
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  finished: {
    label: "Finished",
    icon: <CheckCircle2 className="h-3 w-3" />,
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
};

/** Accent colours used for the spine-like left border. Cycles by book index hint. */
const SPINE_COLORS = [
  "border-l-violet-400",
  "border-l-rose-400",
  "border-l-amber-400",
  "border-l-sky-400",
  "border-l-teal-400",
  "border-l-pink-400",
];

/**
 * Returns a deterministic accent colour for a given book id.
 */
function getSpineColor(id: string): string {
  const index = id.charCodeAt(0) % SPINE_COLORS.length;
  return SPINE_COLORS[index];
}

/**
 * Calculates the reading progress percentage clamped between 0 and 100.
 */
function calculateProgressPercent(book: Book): number {
  if (book.totalPages === 0) return 0;
  return Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
}

/**
 * Card component representing a single book in the reading list.
 */
export function BookCard({ book, onUpdateProgress, onDelete }: BookCardProps) {
  const config = STATUS_CONFIG[book.status];
  const progressPercent = calculateProgressPercent(book);
  const spineColor = getSpineColor(book.id);

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md border-l-4 ${spineColor}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-tight line-clamp-2 text-card-foreground">
            {book.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Delete button – visible on hover */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(book.id)}
          aria-label="Delete book"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Status badge */}
      <Badge
        variant="secondary"
        className={`w-fit gap-1 text-xs font-medium px-2 py-0.5 ${config.badgeClass}`}
      >
        {config.icon}
        {config.label}
      </Badge>

      {/* Progress section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {book.currentPage} / {book.totalPages} pages
          </span>
          <span className="font-medium tabular-nums">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Update progress button */}
      <Button
        variant="outline"
        size="sm"
        className="mt-1 h-8 text-xs"
        onClick={() => onUpdateProgress(book)}
      >
        Update progress
      </Button>
    </div>
  );
}
