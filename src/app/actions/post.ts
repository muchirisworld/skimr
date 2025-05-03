import { db } from "@/drizzle";
import { post, tag, postTag } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
    region: process.env.AWS_REKOGNITION_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_REKOGNITION_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_REKOGNITION_SECRET_ACCESS_KEY!,
    },
});

export type CreatePostInput = {
    userId: string;
    title: string;
    description?: string;
    imageUrl: string;
    s3Key: string;
};

export type TagWithConfidence = {
    name: string;
    confidence: number;
};

export const createPost = async (input: CreatePostInput) => {
    try {
        // Use Rekognition to detect labels in the image
        const detectLabelsCommand = new DetectLabelsCommand({
            Image: {
                S3Object: {
                    Bucket: process.env.AWS_BUCKET_NAME!,
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
            // Create the post
            const [newPost] = await tx.insert(post)
                .values(input)
                .returning();

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
                post: newPost,
                tags: tags.map(({ tag, confidence }) => ({
                    ...tag,
                    confidence,
                })),
            };
        });

        return result;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}; 