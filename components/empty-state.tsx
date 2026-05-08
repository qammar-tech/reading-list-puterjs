import { BookMarked } from "lucide-react";
import type { FilterOption } from "@/lib/types";

interface EmptyStateProps {
  filter: FilterOption;
}

const MESSAGES: Record<FilterOption, { heading: string; sub: string }> = {
  all: {
    heading: "Your reading list is empty",
    sub: "Add your first book to get started.",
  },
  reading: {
    heading: "Nothing in progress",
    sub: "Books you are currently reading will appear here.",
  },
  "to-read": {
    heading: "No books queued",
    sub: "Add books you want to read in the future.",
  },
  finished: {
    heading: "No finished books yet",
    sub: "Books you have completed will show up here.",
  },
};

/**
 * Placeholder shown when the filtered list has no results.
 */
export function EmptyState({ filter }: EmptyStateProps) {
  const { heading, sub } = MESSAGES[filter];
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <BookMarked className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-foreground">{heading}</p>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
