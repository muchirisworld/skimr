import '../../env-config.ts';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is missing');

const client = postgres(connectionString, { ssl: true });
export const db = drizzle(client, { schema });