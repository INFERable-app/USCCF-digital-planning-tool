import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      sub: string;
      email: string;
      name: string;
      picture?: string;
    };
    pkce?: {
      code_verifier: string;
      state: string;
    };
  }
}
