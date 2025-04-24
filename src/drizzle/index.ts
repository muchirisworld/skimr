import './envConfig.ts'
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema";

export const db = drizzle({
    schema: schema,
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    }
});