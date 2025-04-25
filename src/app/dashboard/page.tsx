import ContentLayout from '@/components/layout/content-layout'
import React from 'react'
import UploadModal from './_components/upload-modal'

const Dashboard = () => {
  return (
    <ContentLayout
        title={"Explore"}
        subtitle={"Explore the latest content from your friends and the community."}
        headerAction={
            <UploadModal />
        }
    >
        wareva
    </ContentLayout>
  )
}

export default Dashboard
