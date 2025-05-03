"use client";

import { useState } from "react";
import Masonry from "react-masonry-css";
import { cn } from "@/lib/utils";
import { ImageCard } from "./image-card";
import { ImageModal } from "./image-modal";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { PostWithDetails } from "@/app/actions/post";

interface ImageData extends PostWithDetails {
  width?: number;
  height?: number;
}

interface ImageGridProps {
  initialImages: ImageData[];
  className?: string;
}

export function ImageGrid({ initialImages, className }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 640px)");

  const columnCount = isDesktop ? 4 : isTablet ? 3 : 2;

  return (
    <>
      <Masonry
        breakpointCols={columnCount}
        className={cn(
          "flex w-auto -ml-4", 
          className
        )}
        columnClassName="pl-4 bg-transparent"
      >
        {initialImages.map((image) => (
          <div key={image.id} className="mb-4">
            <ImageCard
              image={image}
              onView={() => setSelectedImage(image)}
            />
          </div>
        ))}
      </Masonry>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}