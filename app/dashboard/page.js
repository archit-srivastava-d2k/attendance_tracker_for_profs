
'use client'
import { useTheme } from 'next-themes'
import React, { useEffect } from 'react'

function dashboard() {
    const { setTheme } = useTheme()
    useEffect(() => {
        setTheme('light')
       })
  return (
 
    <div>
     page
    </div>
  )
}

export default dashboard
