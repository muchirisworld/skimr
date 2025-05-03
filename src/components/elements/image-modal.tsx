"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagList } from "./tag-list";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTransition } from "react";
import { deletePost } from "@/app/actions/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { PostWithDetails } from "@/types/post";

interface ImageModalProps {
  image: PostWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const [activeTab, setActiveTab] = useState<'tags' | 'info'>('tags');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { userId } = useAuth();

  const handleDelete = () => {
    // Check if current user is the owner of the post
    if (userId !== image.userId) {
      toast.error("You can only delete your own posts");
      return;
    }

    if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deletePost(image.id);
          toast.success("Image deleted successfully");
          router.refresh();
          onClose();
        } catch (error) {
          console.error("Error deleting image:", error);
          toast.error("Failed to delete image");
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] xl:max-w-7xl h-[90vh] flex flex-col overflow-hidden p-0">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image container */}
          <div className="flex-1 overflow-hidden bg-black flex items-center justify-center min-h-[40vh] md:min-h-0">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-auto h-auto max-w-full max-h-[90vh] md:max-h-[85vh] object-contain"
            />
          </div>
          
          {/* Details sidebar */}
          <div className="w-full md:w-96 flex flex-col overflow-hidden border-t md:border-t-0 md:border-l">
            <DialogHeader className="px-4 py-3 border-b">
              <DialogTitle className="text-lg">{image.title}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={new Date(image.createdAt).toISOString()}>
                  {format(new Date(image.createdAt), "MMM d, yyyy")}
                </time>
              </div>
            </DialogHeader>

            <div className="flex border-b">
              <Button 
                variant="ghost" 
                className={cn(
                  "flex-1 rounded-none",
                  activeTab === 'tags' && "border-b-2 border-primary"
                )}
                onClick={() => setActiveTab('tags')}
              >
                Tags
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex-1 rounded-none",
                  activeTab === 'info' && "border-b-2 border-primary"
                )}
                onClick={() => setActiveTab('info')}
              >
                Info
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'tags' ? (
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">AI-Generated Tags</h3>
                    <TagList 
                      tags={image.tags} 
                      withConfidence={true} 
                      className="gap-2"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tag Confidence</h3>
                    <ScrollArea className="h-[220px] rounded-md border p-4">
                      <div className="space-y-2 pr-4">
                        {image.tags.map((tag) => (
                          <div key={tag.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{tag.name}</span>
                              <span className="text-muted-foreground">
                                {Math.round(tag.confidence)}%
                              </span>
                            </div>
                            <Progress value={tag.confidence} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {image.description && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Description</h3>
                      <p className="text-sm text-muted-foreground">{image.description}</p>
                    </div>
                  )}
                  
                  <Card className="p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">File name</span>
                        <span className="font-medium">{image.title}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uploaded</span>
                        <span className="font-medium">
                          {format(new Date(image.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tags</span>
                        <span className="font-medium">{image.tags.length}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex border-t p-3">
              <div className="flex w-full justify-between">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      toast.info("Edit tags coming soon");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  
                  <Button
                    onClick={() => {
                      window.open(image.imageUrl, '_blank');
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}