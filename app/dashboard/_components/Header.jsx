"use client"
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';
import React from 'react'

const Header = () => {
    const {user} = useKindeBrowserClient();
  return (
    <div className='flex justify-between border shadow-sm mx-4'>

        <div>

        </div>
        <div className='flex items-center p-2 '>

        <Image className='rounded-full' src={user?.picture} alt={user?.name} width={40} height={40} />
        </div>
       
    </div>
  )
}

export default Header
