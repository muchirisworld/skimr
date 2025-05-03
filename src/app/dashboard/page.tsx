import ContentLayout from '@/components/layout/content-layout';
import UploadModal from './_components/upload-modal';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List } from 'lucide-react';
import { ImageGrid } from '@/components/elements/image-grid';
import { getPosts } from '@/app/actions/post';

const Dashboard = async () => {
    const posts = await getPosts();

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
                    <Tabs defaultValue="all" className="w-[300px]">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="tagged">Tagged</TabsTrigger>
                            <TabsTrigger value="untagged">Untagged</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <ImageGrid initialImages={posts} />

        </ContentLayout>
    )
}

export default Dashboard
