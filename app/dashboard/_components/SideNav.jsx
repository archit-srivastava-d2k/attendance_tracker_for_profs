'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { GraduationCap, Hand, LayoutIcon, Settings2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import MobileSideMenu from '@/app/_components/MobileSideMenu';

const SideNav = () => {
    const { user } = useKindeBrowserClient();

    const menuList = [
        {
            id: 1,
            name: "Dashboard",
            icon: LayoutIcon,
            link: "/dashboard",
        },
        {
            id: 2,
            name: "Students",
            icon: GraduationCap,
            link: "/dashboard/students",
        },
        {
            id: 3,
            name: "Attendance",
            icon: Hand,
            link: "/dashboard/attendance",
        },
        {
            id: 4,
            name: "Settings",
            icon: Settings2,
            link: "/dashboard/settings",
        },
    ];

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Desktop/Tablet Side Navigation */}
            <div className="hidden lg:flex border border-black-500 p-5 h-screen flex-col lg:w-64 w-full lg:fixed bg-white shadow-lg">
                <Image src="/logo.svg" alt="logo" width={180} height={100} className="mx-auto" />
                <hr className="mt-5 border-gray-300" />
                <div className="flex-1 flex flex-col justify-between mt-5">
                    <div className="space-y-3">
                        {menuList.map((item) => (
                            <Link href={item.link} key={item.id} className="flex gap-2 items-center p-4 rounded-md hover:bg-gray-100 transition">
                                <item.icon size={20} className="text-gray-700" />
                                <span className="text-gray-700 font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* User Profile */}
                    <div className="mt-auto flex gap-2 items-center p-4 border-t border-gray-200">
                        {user?.picture && (
                            <Image
                                src={user.picture}
                                className="rounded-full"
                                alt="User Picture"
                                width={40}
                                height={40}
                            />
                        )}
                        <div>
                            <p className="text-gray-700 font-medium truncate">{user?.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Bar */}
            <div className="lg:hidden">
                <MobileSideMenu />
            </div>
        </div>
    );
};

export default SideNav;