"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  FolderPlus,
  Grid,
  MoreHorizontal,
  Star,
  Tag,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ContentLayout from "@/components/layout/content-layout";

// Sample collections
const collections = [
  {
    id: "1",
    name: "Favorites",
    imageCount: 42,
    icon: Star,
    coverImage: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isDefault: true
  },
  {
    id: "2",
    name: "Nature",
    imageCount: 16,
    icon: FolderOpen,
    coverImage: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "3",
    name: "Portraits",
    imageCount: 8,
    icon: FolderOpen,
    coverImage: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "4", 
    name: "Architecture",
    imageCount: 12,
    icon: FolderOpen,
    coverImage: "https://images.pexels.com/photos/2070047/pexels-photo-2070047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "5",
    name: "Food",
    imageCount: 7,
    icon: FolderOpen,
    coverImage: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "6",
    name: "Travel",
    imageCount: 23,
    icon: FolderOpen,
    coverImage: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
]

// Popular tags
const popularTags = [
  { name: "landscape", count: 48 },
  { name: "portrait", count: 32 },
  { name: "nature", count: 89 },
  { name: "city", count: 25 },
  { name: "architecture", count: 42 },
  { name: "food", count: 18 },
  { name: "people", count: 36 },
  { name: "travel", count: 54 },
];

export default function CollectionsPage() {

  const handleCreateCollection = () => {
    toast("Collection created: New collection has been created successfully.");
  };

  const handleDeleteCollection = (name: string) => {
    toast(`Collection deleted: "${name}" collection has been deleted.`, { className: "text-red-500" });
  };

  return (
    <ContentLayout
      title="Collections"
      subtitle="Organize your images into collections for easier access and management."
      headerAction={
        <Button onClick={handleCreateCollection}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      }
    >
      <div className="">        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDelete={() => handleDeleteCollection(collection.name)}
            />
          ))}
          
          <Card className="flex items-center justify-center h-[220px] border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors group">
            <CardContent className="flex flex-col items-center justify-center p-6 h-full">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <FolderPlus className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Create Collection</h3>
              <p className="text-sm text-muted-foreground text-center">
                Group your images in a new collection
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Tags</h2>
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium">Popular Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <div
                  key={tag.name}
                  className="bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>{tag.name}</span>
                  <span className="bg-background text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {tag.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    imageCount: number;
    icon: React.ElementType;
    coverImage: string;
    isDefault?: boolean;
  };
  onDelete: () => void;
}

function CollectionCard({ collection, onDelete }: CollectionCardProps) {
  const Icon = collection.icon;
  
  return (
    <Link href="#" passHref>
      <Card className="overflow-hidden h-[320px] p-0 cursor-pointer hover:shadow-md transition-shadow">
        <div className="relative h-2/3">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-black/60" />
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          {!collection.isDefault && (
            <div className="absolute top-3 right-3 z-20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center",
              collection.isDefault ? "text-yellow-500" : "text-primary"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="font-medium">{collection.name}</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {collection.imageCount} {collection.imageCount === 1 ? "image" : "images"}
            </p>
            <div className="flex -space-x-2">
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background"></div>
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background"></div>
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background"></div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}