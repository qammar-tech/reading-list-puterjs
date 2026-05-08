"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthScreenProps {
  onSignIn: () => void;
  isLoading: boolean;
}

/**
 * Full-page sign-in screen shown to unauthenticated visitors.
 */
export function AuthScreen({ onSignIn, isLoading }: AuthScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4">
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <BookOpen className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reading List</h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
            Track the books you are reading, want to read, and have finished -- all stored securely in your Puter account.
          </p>
        </div>
      </div>

      {/* CTA */}
      <Button size="lg" onClick={onSignIn} disabled={isLoading} className="w-full max-w-xs">
        {isLoading ? "Signing in..." : "Sign in with Puter"}
      </Button>

      {/* Footer */}
      <p className="text-xs text-muted-foreground">
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
    </div>
  );
}
