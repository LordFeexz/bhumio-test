declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;
      CORS_LIST: string;
      PORT: string;
      TOKEN_SECRET: string;
    }
  }
}

export {};
