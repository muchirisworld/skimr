import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        // Process each file
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                // Here you would typically:
                // 1. Validate the file (type, size, etc.)
                // 2. Upload to your storage service (S3, etc.)
                // 3. Save metadata to your database
                
                // For now, we'll just return the file info
                return {
                    name: file.name,
                    type: file.type,
                    size: file.size
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