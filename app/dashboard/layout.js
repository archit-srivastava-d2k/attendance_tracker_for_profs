import React from 'react'
import Header from './_components/Header'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/app-sidebar'

function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div className="hidden md:block  bg-gray-100">
          <AppSidebar />
        </div>
        <div className="flex-1 bg-white overflow-auto">
       
          <SidebarTrigger />
          <Header />
          <main className="p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
