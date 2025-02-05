import Navbar from '@/components/level-3/Navbar'
import React from 'react'

function layout({children}) {
  return (
    <div className='font-sans antialiased h-screen'>
      <Navbar/>
      {children}
    </div>
  )
}

export default layout
