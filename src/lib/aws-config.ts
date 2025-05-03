import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { S3Client } from "@aws-sdk/client-s3";

export const rekognitionClient = new RekognitionClient({
    region: process.env.AWS_REKOGNITION_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_REKOGNITION_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_REKOGNITION_SECRET_ACCESS_KEY!,
    },
});

export const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
});