"use client";

import { ArrowDownUp, Clock } from "lucide-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

interface SortResultsProps {
    totalResults: number;
    sortBy: string;
    onSortChange: (value: string) => void;
}

export function SortResults({ totalResults, sortBy, onSortChange }: SortResultsProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="text-sm">
                <span className="font-medium">{totalResults}</span> 
                <span className="text-muted-foreground ml-1">results</span>
            </div>
            
            <Select defaultValue={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="relevance">
                        <div className="flex items-center">
                            <ArrowDownUp className="mr-2 h-4 w-4" />
                            Relevance
                        </div>
                    </SelectItem>
                    <SelectItem value="confidence">
                        <div className="flex items-center">
                            <ArrowDownUp className="mr-2 h-4 w-4" />
                            Confidence
                        </div>
                    </SelectItem>
                    <SelectItem value="recent">
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            Most Recent
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}