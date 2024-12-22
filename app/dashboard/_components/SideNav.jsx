'use client'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { GraduationCap, Hand, LayoutIcon, Settings2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const SideNav = () => {
    const {user} = useKindeBrowserClient();
    const menuList = [
        {
            id: 1,
            name: "Dashboard",
            icon: LayoutIcon ,
            link: "/dashboard"
        },
        {
            id: 2,
            name: "Students",
            icon:GraduationCap,
            link: "/dashboard/students"
        },
        {
            id: 3,
            name: "Attendance",
            icon: Hand,
            link: "/dashboard/attendance"
        },
        {
            id: 4,
            name: "Settings",
            icon: Settings2,
            link: "/dashboard/settings"
        }
    ]
  return (

    <div className=' border  border-black-500 p-5 h-screen'>
    <Image src={"/logo.svg"} alt='logo' width={180} height={100}   />
    <hr color='white' className='mt-5 border ' />
    <div className='flex  flex-col'>


    <div className='mt-10'>
        {
            menuList.map((item, index) => (
                <div key={index} className='flex gap-2 items-center  p-4' >
                    <item.icon size={20} />
                    < Link href={item.link}>{item.name}</Link>
                </div>
            ))
        }
    </div>
    <div>
      <div className='flex gap-2 items-center bottom-5 fixed p-4'>

        <Image src={user?.picture} className='rounded-full'  alt='picture' width={40} height={40}   />
      <div className=''>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default SideNav
