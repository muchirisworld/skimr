import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { lifecycleDates } from "./utils";

export const user = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    ...lifecycleDates
});

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;