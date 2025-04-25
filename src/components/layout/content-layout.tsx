import React, { ReactNode } from 'react';

type ContentLayoutProps = {
    title: string;
    subtitle?: string;
    headerAction?: ReactNode;
    children: ReactNode;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({
    title,
    subtitle,
    headerAction,
    children
}) => {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex justify-between px-6 py-4 border-b border-muted">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </div>
                {headerAction && (
                    <div className="ml-4">
                        {headerAction}
                    </div>
                )}
            </div>
            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
};

export default ContentLayout;
