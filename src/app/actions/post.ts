"use server";

import { db } from "@/drizzle";
import { post, tag, postTag, type Post } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const rekognitionClient = new RekognitionClient({
    region: process.env.AWS_REKOGNITION_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_REKOGNITION_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_REKOGNITION_SECRET_ACCESS_KEY!,
    },
});

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
});

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

export const createPost = async (input: CreatePostInput) => {
    try {
        // Add a delay to allow S3 object to propagate (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
            // Use Rekognition to detect labels in the image
            const detectLabelsCommand = new DetectLabelsCommand({
                Image: {
                    S3Object: {
                        Bucket: process.env.AWS_S3_BUCKET_NAME!,
                        Name: input.s3Key,
                    },
                },
                MaxLabels: 10,
                MinConfidence: 70,
            });

            const rekognitionResponse = await rekognitionClient.send(detectLabelsCommand);
            const detectedLabels: TagWithConfidence[] = rekognitionResponse.Labels?.map(label => ({
                name: label.Name!,
                confidence: label.Confidence!,
            })) || [];

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
                        post: { ...newPost, imageUrl: input.imageUrl }, // Add imageUrl back for the response
                        tags: tags.map(({ tag, confidence }) => ({
                            ...tag,
                            confidence,
                        })),
                    };
                }

                return {
                    post: { ...newPost, imageUrl: input.imageUrl }, // Add imageUrl back for the response
                    tags: [],
                };
            });

            return result;
        } catch (rekognitionError) {
            console.error("Rekognition error:", rekognitionError);
            // If Rekognition fails, still create the post but without tags
            const [newPost] = await db.insert(post)
                .values({
                    userId: input.userId,
                    title: input.title,
                    description: input.description,
                    s3Key: input.s3Key,
                })
                .returning();
            
            return {
                post: { ...newPost, imageUrl: input.imageUrl }, // Add imageUrl back for the response
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
                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Key: row.post.s3Key,
                });
                const imageUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

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

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: results[0].post.s3Key,
        });
        const imageUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

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
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: postToDelete.s3Key,
        }));

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