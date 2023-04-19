declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            API_PORT: string;
            JWT_SECRET: string;
            SENTRY_DSN: string;
        }
    }
}
export {};
