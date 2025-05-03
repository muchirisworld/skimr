"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TagList } from "./tag-list";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Star,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { PostWithDetails } from "@/app/actions/post";
import { deletePost } from "@/app/actions/post";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface ImageCardProps {
  image: PostWithDetails;
  onView: () => void;
}

export function ImageCard({ image, onView }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const img = new Image();
    img.src = image.imageUrl;
    img.onload = () => {
      setDimensions({
        width: img.width,
        height: img.height
      });
    };
  }, [image.imageUrl]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast(isFavorite ? "Removed from favorites" : "Added to favorites", {
      description: `"${image.title}" ${isFavorite ? "removed from" : "added to"} your favorites collection.`,
      duration: 3000,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deletePost(image.id);
          toast.success("Image deleted successfully");
          router.refresh();
        } catch (error) {
          console.error("Error deleting image:", error);
          toast.error("Failed to delete image");
        }
      });
    }
  };

  // Calculate padding based on image dimensions with a default 2:3 ratio
  const paddingBottom = dimensions 
    ? `${(dimensions.height / dimensions.width) * 100}%`
    : '66.67%';

  return (
    <Card 
      className={cn(
        "overflow-hidden group transition-all duration-200 hover:shadow-md",
        "border-transparent hover:border-border"
      )}
      onClick={onView}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/0 to-black/60 z-10 opacity-0 transition-opacity duration-200",
          isHovered && "opacity-100"
        )} />
        
        <CardContent className="relative p-0 cursor-pointer">
          <div 
            className="relative"
            style={{ paddingBottom }}
          >
            <img
              src={image.imageUrl}
              alt={image.title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-transform duration-500",
                isHovered && "scale-105"
              )}
            />
          </div>
          
          <div className={cn(
            "absolute top-2 right-2 z-20 opacity-0 transition-opacity duration-200",
            isHovered && "opacity-100"
          )}>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={handleFavorite}
            >
              <Star 
                className={cn(
                  "h-4 w-4",
                  isFavorite && "fill-yellow-400 text-yellow-400"
                )} 
              />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
          
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 z-20 opacity-0 transition-opacity duration-200 flex items-center justify-between gap-2",
            isHovered && "opacity-100"
          )}>
            <Button 
              size="sm"
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(image.imageUrl, '_blank');
                }}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Edit tags coming soon");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Tags</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </div>
      
      <CardFooter className="flex flex-col items-start gap-2 p-3">
        <div className="w-full flex items-center justify-between gap-2">
          <h3 className="font-medium text-sm line-clamp-1">{image.title}</h3>
          <time className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(image.createdAt), "MMM d")}
          </time>
        </div>
        <TagList tags={image.tags.slice(0, 5)} className="gap-1.5" />
      </CardFooter>
    </Card>
  );
}