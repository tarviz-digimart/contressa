import Navbar from '@/components/level-3/Navbar'
import React from 'react'

function layout({children}) {
  return (
    <div>
      <Navbar/>
      {children}
    </div>
  )
}

export default layout
