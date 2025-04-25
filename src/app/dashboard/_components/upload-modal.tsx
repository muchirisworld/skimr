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

const UploadModal = () => {
    const [open, setOpen] = useState(false);
    const maxSizeMB = 5;
    const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
    const maxFiles = 6;

    const [state, actions] = useFileUpload({
        accept: "image/*",
        maxSize,
        multiple: true,
        maxFiles,
    });

    const uploadImage = async () => {
        if (state.files.length === 0) {
            toast.error("Please select at least one image to upload");
            return;
        }

        try {
            const formData = new FormData();
            state.files.forEach((fileWrapper) => {
                if (fileWrapper.file instanceof File) {
                    formData.append('files', fileWrapper.file);
                }
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            toast.success(JSON.stringify(data));
            actions.clearFiles();
            setOpen(false);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error("Failed to upload files. Please try again.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button
                    variant={"outline"}
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
                <ImageHandler 
                    state={state} 
                    actions={actions}
                    maxSizeMB={maxSizeMB}
                    maxFiles={maxFiles}
                />
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
                        >
                            Upload
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UploadModal;
