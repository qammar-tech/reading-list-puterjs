"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import type { Book, ReadingStatus, UpdateProgressInput } from "@/lib/types";

interface UpdateProgressDialogProps {
  book: Book | null;
  onClose: () => void;
  onSave: (input: UpdateProgressInput) => Promise<void>;
}

/**
 * Modal dialog for updating the reading progress of a selected book.
 */
export function UpdateProgressDialog({
  book,
  onClose,
  onSave,
}: UpdateProgressDialogProps) {
  const [currentPage, setCurrentPage] = useState("");
  const [status, setStatus] = useState<ReadingStatus>("reading");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync local state whenever the target book changes.
  useEffect(() => {
    if (book) {
      setCurrentPage(String(book.currentPage));
      setStatus(book.status);
    }
  }, [book]);

  const progressPercent =
    book && book.totalPages > 0
      ? Math.round((parseInt(currentPage || "0", 10) / book.totalPages) * 100)
      : 0;

  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!book) return;
    const page = parseInt(currentPage, 10);
    if (isNaN(page) || page < 0) return;

    setIsSubmitting(true);
    try {
      await onSave({
        id: book.id,
        currentPage: Math.min(page, book.totalPages),
        status,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={!!book} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="leading-tight line-clamp-1">
            {book?.title}
          </DialogTitle>
        </DialogHeader>

        {book && (
          <form onSubmit={handleSave} className="space-y-4 py-2">
            {/* Live progress preview */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {currentPage || 0} / {book.totalPages} pages
              </p>
            </div>

            {/* Current page input */}
            <div className="space-y-1.5">
              <Label htmlFor="page">Current page</Label>
              <Input
                id="page"
                type="number"
                min={0}
                max={book.totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                required
              />
            </div>

            {/* Status select */}
            <div className="space-y-1.5">
              <Label htmlFor="progressStatus">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => value && setStatus(value as ReadingStatus)}
              >
                <SelectTrigger id="progressStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-read">To Read</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save progress"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
