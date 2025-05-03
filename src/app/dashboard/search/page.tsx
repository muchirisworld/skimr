"use client";

import { useState, useEffect } from "react";
import ContentLayout from "@/components/layout/content-layout";
import { ImageGrid } from "@/components/elements/image-grid";
import { FiltersSidebar } from "./_components/filters-sidebar";
import { MobileFilters } from "./_components/mobile-filters";
import { SelectedTags } from "./_components/selected-tags";
import { SortResults } from "./_components/sort-results";
import { getPosts } from "@/app/actions/post";
import type { PostWithDetails, TagWithConfidence } from "@/types/post";

export default function SearchPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState([50]);
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [images, setImages] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState("");

  // Get unique tags from actual data
  const allTags = Array.from(
    new Set(
      images.flatMap((img) => img.tags.map((tag) => tag.name))
    )
  ).map((name) => {
    // Find highest confidence for each tag
    const highestConfidence = Math.max(
      ...images.flatMap((img) => 
        img.tags.filter((tag) => tag.name === name)
          .map((tag) => tag.confidence)
      )
    );
    
    return { name, confidence: highestConfidence };
  }).sort((a, b) => b.confidence - a.confidence);
  
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const posts = await getPosts();
        setImages(posts);
      } catch (error) {
        console.error('Error loading images:', error);
      }
      setLoading(false);
    };
    loadImages();
  }, []);

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };
  
  const filteredImages = images.filter(image => {
    if (selectedTags.length === 0) return true;
    
    return selectedTags.every(tag => 
      image.tags.some(imageTag => 
        imageTag.name === tag && 
        imageTag.confidence >= confidenceThreshold[0]
      )
    );
  });
  
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "confidence") {
      // Average confidence of selected tags
      const getAvgConfidence = (img: PostWithDetails) => {
        if (selectedTags.length === 0) return 0;
        
        const tagConfidences = selectedTags.map(tag => {
          const foundTag = img.tags.find(t => t.name === tag);
          return foundTag ? foundTag.confidence : 0;
        });
        
        return tagConfidences.reduce((acc, val) => acc + val, 0) / tagConfidences.length;
      };
      
      return getAvgConfidence(b) - getAvgConfidence(a);
    }
    
    // Default: relevance (more matching tags first)
    const aMatchCount = a.tags.filter(tag => selectedTags.includes(tag.name)).length;
    const bMatchCount = b.tags.filter(tag => selectedTags.includes(tag.name)).length;
    return bMatchCount - aMatchCount;
  });

  return (
    <ContentLayout
      title="Search Images"
      subtitle="Search through your images using AI-generated tags. Filter by tags and confidence levels to find exactly what you need."
    >
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Desktop Filters */}
        <FiltersSidebar
          allTags={allTags}
          selectedTags={selectedTags}
          confidenceThreshold={confidenceThreshold}
          sortBy={sortBy}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
          onTagToggle={toggleTag}
          onConfidenceChange={setConfidenceThreshold}
          onSortChange={setSortBy}
          onClearTags={() => setSelectedTags([])}
        />
        
        {/* Main content */}
        <div className="space-y-6">
          {/* Mobile Filters */}
          <MobileFilters
            isOpen={isFilterOpen}
            selectedTags={selectedTags}
            allTags={allTags}
            confidenceThreshold={confidenceThreshold}
            onTagToggle={toggleTag}
            onConfidenceChange={setConfidenceThreshold}
            onClearTags={() => setSelectedTags([])}
            onToggleFilters={() => setIsFilterOpen(!isFilterOpen)}
          />
          
          {/* Selected tags */}
          <SelectedTags
            tags={selectedTags}
            onRemoveTag={toggleTag}
          />
          
          {/* Sort Results */}
          <SortResults
            totalResults={sortedImages.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          
          {/* Image Grid */}
          <ImageGrid initialImages={sortedImages} />
        </div>
      </div>
    </ContentLayout>
  );
}