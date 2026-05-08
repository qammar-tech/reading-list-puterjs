# Reading List with Progress

A clean, minimal reading tracker that lets you manage your books and monitor
your reading progress. All data is stored securely in your Puter cloud account
-- no backend, no database, no infrastructure to manage.

## Features

- Add books with title, author, and total page count
- Track reading progress with a live progress bar
- Three reading statuses: To Read, Reading, Finished
- Filter the list by status
- Data persists across devices via Puter cloud storage
- Sign in with your existing Puter account

## Tech Stack

- [Next.js](https://nextjs.org) -- React framework
- [Tailwind CSS](https://tailwindcss.com) -- utility-first styling
- [Shadcn UI](https://ui.shadcn.com) -- accessible component primitives
- [Lucide Icons](https://lucide.dev) -- icon set
- [Puter.js](https://docs.puter.com) -- serverless cloud storage and auth

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  page.tsx          Main page -- auth flow and reading list UI
  layout.tsx        Root layout and metadata
lib/
  types.ts          Shared TypeScript types (Book, ReadingStatus, etc.)
  puter-service.ts  Puter KV read/write helpers
  puter.d.ts        Ambient type declarations for window.puter
components/
  book-card.tsx           Book card with progress bar
  add-book-dialog.tsx     Dialog for adding a new book
  update-progress-dialog.tsx  Dialog for updating reading progress
  filter-tabs.tsx         Tab strip for filtering by status
  auth-screen.tsx         Sign-in landing screen
  empty-state.tsx         Placeholder for empty filtered lists
```

## Built with Puter.js

This app uses [Puter.js](https://docs.puter.com) to store and retrieve the
reading list without any backend code. Authentication is handled by Puter
accounts, and all book data lives in the Puter Key-Value store under the
authenticated user's namespace. Learn more at
[docs.puter.com](https://docs.puter.com).

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
