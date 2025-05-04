import '../../env-config.ts';

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

const connectionString = process.env.DATABASE_URL;

// Configure connection with required SSL for Supabase
export const client = postgres(connectionString, { 
    prepare: false,
    ssl: true, // Required for Supabase
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    max_lifetime: 60 * 30,
    onnotice: () => {},
    onparameter: () => {},
    debug: process.env.NODE_ENV === 'development'
});

export const db = drizzle(client, { schema });