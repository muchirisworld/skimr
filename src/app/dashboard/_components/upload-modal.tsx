"use client";

import ImageHandler from "@/components/image-handler";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useFileUpload } from "@/hooks/use-file-upload";
import { UploadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface UploadModalProps {
    onUploadSuccess?: () => Promise<void>;
}

const UploadModal = ({ onUploadSuccess }: UploadModalProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const maxSizeMB = 5;
    const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
    const maxFiles = 6;

    const [state, actions] = useFileUpload({
        accept: "image/jpeg,image/png,image/jpg",
        maxSize,
        multiple: true,
        maxFiles,
    });

    const uploadImage = async () => {
        if (state.files.length === 0) {
            toast.error("Please select at least one image to upload");
            return;
        }

        const uploadPromise = async () => {
            const formData = new FormData();
            state.files.forEach((fileWrapper) => {
                if (fileWrapper.file instanceof File) {
                    formData.append('files', fileWrapper.file);
                }
            });

            if (title) {
                formData.append('title', title);
            }
            if (description) {
                formData.append('description', description);
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return response.json();
        };

        try {
            setIsUploading(true);
            await toast.promise(uploadPromise(), {
                loading: 'Uploading images...',
                success: async () => {
                    actions.clearFiles();
                    setTitle("");
                    setDescription("");
                    setOpen(false);
                    if (onUploadSuccess) {
                        await onUploadSuccess();
                    }
                    return "Images uploaded successfully!";
                },
                error: (error) => {
                    console.error('Upload error:', error);
                    return "Failed to upload files. Please try again.";
                },
            });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    disabled={isUploading}
                >
                    <UploadIcon className="mr-1" />
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Images</DialogTitle>
                    <DialogDescription>
                        Select the images you want to upload. Maximum {maxFiles} files, up to {maxSizeMB}MB each.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter a title for your images"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter a description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <ImageHandler 
                        state={state} 
                        actions={actions}
                        maxSizeMB={maxSizeMB}
                        maxFiles={maxFiles}
                    />
                </div>
                <DialogFooter>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={"secondary"}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={uploadImage}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadModal;
