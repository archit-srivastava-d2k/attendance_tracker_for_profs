
'use client'
import { useTheme } from 'next-themes'
import React, { useEffect ,useState} from 'react'
import Loading from '../_components/Loading'

function dashboard() {
    const { setTheme } = useTheme()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      setTheme('light'); // Set the theme to light
      const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading time
      return () => clearTimeout(timer); // Clean up the timer
    }, [setTheme]);
  if(loading) {
    return (
     <Loading/>
    )
  }
  return (
 
    <div>
     page
    </div>
  )
}

export default dashboard
