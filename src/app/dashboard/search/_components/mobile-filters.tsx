"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import type { TagWithConfidence } from "@/types/post";

interface MobileFiltersProps {
    isOpen: boolean;
    selectedTags: string[];
    allTags: TagWithConfidence[];
    confidenceThreshold: number[];
    onTagToggle: (tag: string) => void;
    onConfidenceChange: (values: number[]) => void;
    onClearTags: () => void;
    onToggleFilters: () => void;
}

export function MobileFilters({
    isOpen,
    selectedTags,
    allTags,
    confidenceThreshold,
    onTagToggle,
    onConfidenceChange,
    onClearTags,
    onToggleFilters,
}: MobileFiltersProps) {
    return (
        <div className="md:hidden">
            <Button
                variant="outline"
                className="w-full"
                onClick={onToggleFilters}
            >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                        {selectedTags.length}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <div className="bg-card border rounded-lg p-4 mb-4 mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Filters</h2>
                        {selectedTags.length > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={onClearTags}
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Popular Tags</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {allTags.slice(0, 12).map((tag) => (
                                    <Badge
                                        key={tag.name}
                                        variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => onTagToggle(tag.name)}
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium">Confidence Threshold</h3>
                                <span className="text-sm text-muted-foreground">
                                    {confidenceThreshold[0]}%
                                </span>
                            </div>
                            <Slider
                                defaultValue={[50]}
                                max={100}
                                step={5}
                                value={confidenceThreshold}
                                onValueChange={onConfidenceChange}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}