"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagListProps {
  tags: {
    name: string;
    confidence?: number;
  }[];
  variant?: "default" | "secondary" | "outline";
  withConfidence?: boolean;
  className?: string;
}

export function TagList({ tags, variant = "default", withConfidence = false, className }: TagListProps) {
  return (
    <div className={cn("flex flex-wrap", className)}>
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant={variant}
          className="text-xs"
        >
          {tag.name}
          {withConfidence && tag.confidence !== undefined && (
            <span className="ml-1 opacity-60">
              {Math.round(tag.confidence)}%
            </span>
          )}
        </Badge>
      ))}
    </div>
  );
}