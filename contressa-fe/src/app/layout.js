import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/level-3/navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Contessa</title>
      </head>
      <body className={`font-sans antialiased h-screen`}>
        {children}</body>
    </html>
  );
}
