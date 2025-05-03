"use client";

import { Filter, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import type { TagWithConfidence } from "@/types/post";

interface FiltersSidebarProps {
    allTags: TagWithConfidence[];
    selectedTags: string[];
    confidenceThreshold: number[];
    sortBy: string;
    tagFilter: string;
    onTagFilterChange: (value: string) => void;
    onTagToggle: (tag: string) => void;
    onConfidenceChange: (values: number[]) => void;
    onSortChange: (value: string) => void;
    onClearTags: () => void;
}

export function FiltersSidebar({
    allTags,
    selectedTags,
    confidenceThreshold,
    sortBy,
    tagFilter,
    onTagFilterChange,
    onTagToggle,
    onConfidenceChange,
    onSortChange,
    onClearTags,
}: FiltersSidebarProps) {
    const filteredTags = allTags.filter(tag => 
        tag.name.toLowerCase().includes(tagFilter.toLowerCase())
    );

    return (
        <div className="hidden md:block bg-card border rounded-lg p-4 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </h2>
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
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium mb-2">Tag Search</h3>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Filter tags..."
                            className="pl-8"
                            value={tagFilter}
                            onChange={(e) => onTagFilterChange(e.target.value)}
                        />
                    </div>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium mb-2">Popular Tags</h3>
                    <div className="max-h-[300px] overflow-y-auto pr-1">
                        {filteredTags.map((tag) => (
                            <div 
                                key={tag.name}
                                className="flex items-center mb-1"
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start px-2 py-1 h-auto text-sm w-full"
                                    onClick={() => onTagToggle(tag.name)}
                                >
                                    <span className={selectedTags.includes(tag.name) ? "text-primary font-medium" : "text-foreground"}>
                                        {tag.name}
                                    </span>
                                    {selectedTags.includes(tag.name) && (
                                        <Check className="h-3.5 w-3.5 ml-1.5 text-primary" />
                                    )}
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {Math.round(tag.confidence)}%
                                    </span>
                                </Button>
                            </div>
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
                
                <div>
                    <h3 className="text-sm font-medium mb-2">Sort Results</h3>
                    <Select defaultValue={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="confidence">Confidence</SelectItem>
                            <SelectItem value="recent">Most Recent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}