import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPost } from "@/app/actions/post";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        // Validate image formats
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            return NextResponse.json(
                { error: "Only JPEG and PNG images are supported" },
                { status: 400 }
            );
        }

        // Process each file
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const fileBuffer = await file.arrayBuffer();
                const key = `${user.id}/${Date.now()}-${file.name}`;

                const command = new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: Buffer.from(fileBuffer),
                    ContentType: file.type,
                });

                // Wait for S3 upload to complete
                await s3Client.send(command);

                // Generate a signed URL for the uploaded file
                const signedUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600, // URL expires in 1 hour
                });

                // Create post with tags
                const { post, tags } = await createPost({
                    userId: user.id,
                    title: title || file.name,
                    description,
                    imageUrl: signedUrl,
                    s3Key: key,
                });

                return {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: signedUrl,
                    key: key,
                    post,
                    tags,
                };
            })
        );

        return NextResponse.json({
            message: "Files uploaded successfully",
            files: uploadedFiles
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload files" },
            { status: 500 }
        );
    }
}