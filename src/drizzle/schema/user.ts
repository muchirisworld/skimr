import { pgTable, varchar } from "drizzle-orm/pg-core";
import { lifecycleDates } from "./utils";
import { post } from "./post";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
    // id: uuid("id").defaultRandom().primaryKey(),
    id: varchar("id", { length: 255 }).unique().primaryKey().notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    ...lifecycleDates
});

export const userRelations = relations(user,
    ({ many }) => ({
        posts: many(post)
    })
);

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;