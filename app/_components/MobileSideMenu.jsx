'use client';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { GraduationCap, Hand, LayoutIcon, Settings2 } from 'lucide-react';
import Link from 'next/link';

const MobileSideMenu = () => {
    return (
        <Menubar className='md:hidden'>
            <MenubarMenu >
                <MenubarTrigger>Menu</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Link href="/dashboard">
                        <div className='flex items-center '>
                        <LayoutIcon className="mr-2 h-4 w-4" />
                        Dashboard
                        </div>
                           
                        </Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href="/dashboard/students">
                        <div className='flex items-center '>
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Students
                        </div>
                         
                        </Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href="/dashboard/attendance"> 
                            <div className='flex items-center '>
                            <Hand className="mr-2 h-4 w-4" />
                            Attendance
                            </div>
                        </Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href="/dashboard/settings">
                        <div className='flex items-center '>
                        <Settings2 className="mr-2 h-4 w-4" />
                        Settings
                        </div>
                        </Link>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default MobileSideMenu;