import React from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { Button } from '@/components/ui/button'

function layout({children}) {
  return (
    <div>
        <div className='md:64 w-64 fixed md:block'>
      
        <SideNav/>
        </div>
        <div className='md:pl-64'>
            <Header/>
           
      {children}
       </div>
    
    </div>
  )
}

export default layout
