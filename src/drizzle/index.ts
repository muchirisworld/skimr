import '../../env-config.ts';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is missing');

const client = postgres(connectionString, { 
    prepare: false,
    max: 5, // Maximum number of connections
    idle_timeout: 30, // Keep idle connections alive for 30 seconds
    connect_timeout: 30, // Allow 30 seconds to establish connection
    max_lifetime: 60 * 30 // Connection can live for maximum 30 minutes
});

export const db = drizzle(client, { schema });