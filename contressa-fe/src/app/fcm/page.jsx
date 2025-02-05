'use client';
import { generateToken, messaging } from '@/utils/firebase';
import React, { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';

function page() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => { 
      console.log(payload);
    });
  }, []);
  return <div>hii</div>;
}

export default page;
