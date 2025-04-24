import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { lifecycleDates } from "./utils";

export const User = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    ...lifecycleDates
});