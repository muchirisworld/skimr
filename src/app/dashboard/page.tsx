"use client";

import ContentLayout from '@/components/layout/content-layout';
import UploadModal from './_components/upload-modal';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List } from 'lucide-react';
import { ImageGrid } from '@/components/elements/image-grid';
import { getPosts } from '@/app/actions/post';
import { useState } from 'react';
import { useEffect } from 'react';
import { PostWithDetails } from '@/types/post';

const Dashboard = () => {
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
            setLoading(false);
        };
        loadPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        switch (activeTab) {
            case 'tagged':
                return post.tags.length > 0;
            case 'untagged':
                return post.tags.length === 0;
            default:
                return true;
        }
    });

    return (
        <ContentLayout
            title={"Explore"}
            subtitle={"Explore the latest content from your friends and the community."}
            headerAction={
                <UploadModal />
            }
        >
            <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="tagged">Tagged</TabsTrigger>
                            <TabsTrigger value="untagged">Untagged</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <ImageGrid initialImages={filteredPosts} />

        </ContentLayout>
    )
}

export default Dashboard
