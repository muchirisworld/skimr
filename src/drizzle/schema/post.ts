import { pgTable, varchar, text, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { lifecycleDates } from "./utils";
import { relations } from "drizzle-orm";

export const post = pgTable("post", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    s3Key: varchar("s3_key", { length: 1024 }).notNull(),
    ...lifecycleDates
});

export const postRelations = relations(post,
    ({ one }) => ({
        user: one(user, {
            fields: [post.userId],
            references: [user.id]
        })
    })
);

export type Post = typeof post.$inferSelect;
export type PostInsert = typeof post.$inferInsert;