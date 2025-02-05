import Navbar from '@/components/level-3/Navbar';
import React from 'react';

function layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className='mt-14'>{children}</div>
    </div>
  );
}

export default layout;
