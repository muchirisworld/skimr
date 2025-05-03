"use server";

import { db } from "@/drizzle";
import { post, tag, postTag } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { detectImageLabels } from "@/lib/image-recognition";
import { generateSignedUrl, deleteS3Object } from "@/lib/s3-operations";
import type { CreatePostInput, PostWithDetails, TagWithConfidence } from "@/types/post";

export const createPost = async (input: CreatePostInput) => {
    try {
        // Add a delay to allow S3 object to propagate (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
            const detectedLabels = await detectImageLabels(input.s3Key);

            // Start a transaction
            const result = await db.transaction(async (tx) => {
                // Create the post first (without imageUrl)
                const [newPost] = await tx.insert(post)
                    .values({
                        userId: input.userId,
                        title: input.title,
                        description: input.description,
                        s3Key: input.s3Key,
                    })
                    .returning();

                if (detectedLabels.length > 0) {
                    // Create or get existing tags
                    const tags = await Promise.all(
                        detectedLabels.map(async (label) => {
                            const [existingTag] = await tx.select()
                                .from(tag)
                                .where(eq(tag.name, label.name))
                                .limit(1);

                            if (existingTag) {
                                return {
                                    tag: existingTag,
                                    confidence: label.confidence,
                                };
                            }

                            const [newTag] = await tx.insert(tag)
                                .values({ name: label.name })
                                .returning();

                            return {
                                tag: newTag,
                                confidence: label.confidence,
                            };
                        })
                    );

                    // Create post-tag relationships with confidence scores
                    await Promise.all(
                        tags.map(({ tag, confidence }) => 
                            tx.insert(postTag)
                                .values({
                                    postId: newPost.id,
                                    tagId: tag.id,
                                    confidence: confidence.toString(),
                                })
                        )
                    );

                    return {
                        post: { ...newPost, imageUrl: input.imageUrl },
                        tags: tags.map(({ tag, confidence }) => ({
                            ...tag,
                            confidence,
                        })),
                    };
                }

                return {
                    post: { ...newPost, imageUrl: input.imageUrl },
                    tags: [],
                };
            });

            return result;
        } catch (error) {
            console.error("Error creating post with tags:", error);
            // If tag processing fails, still create the post but without tags
            const [newPost] = await db.insert(post)
                .values({
                    userId: input.userId,
                    title: input.title,
                    description: input.description,
                    s3Key: input.s3Key,
                })
                .returning();
            
            return {
                post: { ...newPost, imageUrl: input.imageUrl },
                tags: [],
            };
        }
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const getPosts = async (userId?: string): Promise<PostWithDetails[]> => {
    try {
        let baseQuery = db.select({
            post: post,
            tags: postTag,
            tagNames: tag,
        })
        .from(post)
        .leftJoin(postTag, eq(post.id, postTag.postId))
        .leftJoin(tag, eq(postTag.tagId, tag.id));

        const query = userId 
            ? baseQuery.where(eq(post.userId, userId))
            : baseQuery;

        const results = await query;

        // Group the results by post and create signed URLs
        const postsMap = new Map<string, PostWithDetails>();

        for (const row of results) {
            if (!postsMap.has(row.post.id)) {
                const imageUrl = await generateSignedUrl(row.post.s3Key);
                
                postsMap.set(row.post.id, {
                    ...row.post,
                    imageUrl,
                    tags: [],
                });
            }

            if (row.tags && row.tagNames?.name) {
                const post = postsMap.get(row.post.id)!;
                const tagName = row.tagNames.name;
                if (!post.tags.some(t => t.name === tagName)) {
                    post.tags.push({
                        name: tagName,
                        confidence: Number(row.tags?.confidence ?? 0),
                    });
                }
            }
        }

        return Array.from(postsMap.values());
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getPost = async (postId: string): Promise<PostWithDetails | null> => {
    try {
        const results = await db.select({
            post: post,
            tags: postTag,
            tagNames: tag,
        })
        .from(post)
        .leftJoin(postTag, eq(post.id, postTag.postId))
        .leftJoin(tag, eq(postTag.tagId, tag.id))
        .where(eq(post.id, postId));

        if (results.length === 0) {
            return null;
        }

        const imageUrl = await generateSignedUrl(results[0].post.s3Key);

        const postWithDetails: PostWithDetails = {
            ...results[0].post,
            imageUrl,
            tags: results
                .filter(row => row.tags && row.tagNames)
                .map(row => ({
                    name: row.tagNames?.name ?? 'unknown',
                    confidence: Number(row.tags?.confidence ?? '0'),
                })),
        };

        return postWithDetails;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

export const deletePost = async (postId: string): Promise<void> => {
    try {
        const [postToDelete] = await db.select().from(post).where(eq(post.id, postId));
        if (!postToDelete) {
            throw new Error('Post not found');
        }

        // Delete the image from S3
        await deleteS3Object(postToDelete.s3Key);

        // Delete the post and its relationships from the database
        await db.transaction(async (tx) => {
            // Delete post-tag relationships first
            await tx.delete(postTag).where(eq(postTag.postId, postId));
            // Delete the post
            await tx.delete(post).where(eq(post.id, postId));
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};