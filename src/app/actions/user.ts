import { db } from "@/drizzle"
import { user, UserInsert } from "@/drizzle/schema"
import { eq } from "drizzle-orm";

export const createUser = async (userData: UserInsert) => {
    try {
        return await db.insert(user)
            .values(userData)
            .returning({
                userId: user.id
            });
    } catch (error) {
        console.error(error);
    }
}

export const deleteUser = async (id: string) => {
    try {
        await db.delete(user)
            .where(eq(user.id, id));
        
        return "Deleted successfully";
    } catch (error) {
        console.error(error);
    }
}