import { DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { rekognitionClient } from "@/lib/aws-config";
import type { TagWithConfidence } from "@/types/post";

export async function detectImageLabels(s3Key: string): Promise<TagWithConfidence[]> {
    try {
        const detectLabelsCommand = new DetectLabelsCommand({
            Image: {
                S3Object: {
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Name: s3Key,
                },
            },
            MaxLabels: 10,
            MinConfidence: 70,
        });

        const rekognitionResponse = await rekognitionClient.send(detectLabelsCommand);
        return rekognitionResponse.Labels?.map(label => ({
            name: label.Name!,
            confidence: label.Confidence!,
        })) || [];
    } catch (error) {
        console.error("Error detecting image labels:", error);
        return [];
    }
}