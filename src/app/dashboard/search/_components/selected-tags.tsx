"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SelectedTagsProps {
    tags: string[];
    onRemoveTag: (tag: string) => void;
}

export function SelectedTags({ tags, onRemoveTag }: SelectedTagsProps) {
    if (tags.length === 0) return null;
    
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 flex items-center gap-1"
                >
                    {tag}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveTag(tag)}
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                    </Button>
                </Badge>
            ))}
        </div>
    );
}