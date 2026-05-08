"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type { CreateBookInput, ReadingStatus } from "@/lib/types";

interface AddBookDialogProps {
  onAdd: (input: CreateBookInput) => Promise<void>;
}

const DEFAULT_FORM = {
  title: "",
  author: "",
  totalPages: "",
  currentPage: "0",
  status: "to-read" as ReadingStatus,
};

/**
 * Modal dialog that collects new book details and triggers the onAdd callback.
 */
export function AddBookDialog({ onAdd }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof typeof form, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const totalPages = parseInt(form.totalPages, 10);
    const currentPage = parseInt(form.currentPage, 10);
    if (!form.title.trim() || !form.author.trim() || isNaN(totalPages) || totalPages < 1) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        title: form.title.trim(),
        author: form.author.trim(),
        totalPages,
        currentPage: Math.min(currentPage || 0, totalPages),
        status: form.status,
      });
      setForm(DEFAULT_FORM);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* base-ui uses render prop instead of asChild */}
      <DialogTrigger render={<Button className="gap-2" />}>
        <PlusCircle className="h-4 w-4" />
        Add Book
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new book</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. The Pragmatic Programmer"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div className="space-y-1.5">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="e.g. David Thomas"
              value={form.author}
              onChange={(e) => handleChange("author", e.target.value)}
              required
            />
          </div>

          {/* Page counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="totalPages">Total pages</Label>
              <Input
                id="totalPages"
                type="number"
                min={1}
                placeholder="300"
                value={form.totalPages}
                onChange={(e) => handleChange("totalPages", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentPage">Current page</Label>
              <Input
                id="currentPage"
                type="number"
                min={0}
                placeholder="0"
                value={form.currentPage}
                onChange={(e) => handleChange("currentPage", e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => value && handleChange("status", value)}
            >
              <SelectTrigger id="status">
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
