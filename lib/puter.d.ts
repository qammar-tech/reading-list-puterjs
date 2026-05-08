/**
 * Minimal ambient type declarations for the Puter.js global object.
 * Full types are not shipped by the library so we declare what the app uses.
 */

interface PuterUser {
  username: string;
  email?: string;
}

interface PuterKV {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}

interface PuterAuth {
  signIn(): Promise<PuterUser>;
  signOut(): Promise<void>;
  isSignedIn(): boolean;
  getUser(): Promise<PuterUser>;
}

interface Puter {
  kv: PuterKV;
  auth: PuterAuth;
}

declare global {
  interface Window {
    puter: Puter;
  }
}

export {};
