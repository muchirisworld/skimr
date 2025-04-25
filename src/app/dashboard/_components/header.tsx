import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BellIcon } from '@radix-ui/react-icons';

const Header = () => {
  return (
    <header className="flex sticky top-0 bg-background shrink-0 justify-between h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
            <Button
                size={'icon'}
                variant={'ghost'}
            >
                <BellIcon />
            </Button>
        </div>
    </header>
  )
}

export default Header
