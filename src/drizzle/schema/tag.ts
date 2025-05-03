import { pgTable, varchar, uuid, decimal } from "drizzle-orm/pg-core";
import { post } from "./post";
import { relations } from "drizzle-orm";

export const tag = pgTable("tag", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
});

export const postTag = pgTable("post_tag", {
    postId: uuid("post_id").notNull().references(() => post.id),
    tagId: uuid("tag_id").notNull().references(() => tag.id),
    confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
});

export const postTagRelations = relations(postTag,
    ({ one }) => ({
        post: one(post, {
            fields: [postTag.postId],
            references: [post.id]
        }),
        tag: one(tag, {
            fields: [postTag.tagId],
            references: [tag.id]
        })
    })
);

export type Tag = typeof tag.$inferSelect;
export type TagInsert = typeof tag.$inferInsert;
export type PostTag = typeof postTag.$inferSelect;
export type PostTagInsert = typeof postTag.$inferInsert; 