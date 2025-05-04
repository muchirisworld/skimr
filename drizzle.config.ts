import './env-config.ts';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: "postgresql",
    out: "./src/drizzle/migrations",
    schema: "./src/drizzle/schema",
    strict: true,
    verbose: true,
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});