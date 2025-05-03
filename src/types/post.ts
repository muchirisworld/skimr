import type { Post } from "@/drizzle/schema";

export type CreatePostInput = {
    userId: string;
    title: string;
    description?: string;
    imageUrl: string;  // Used for temporary access, not stored
    s3Key: string;
};

export type TagWithConfidence = {
    name: string;
    confidence: number;
};

export type PostWithDetails = Post & {
    imageUrl: string;
    tags: {
        name: string;
        confidence: number;
    }[];
};