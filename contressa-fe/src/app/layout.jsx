'use client';
import './globals.css';
import Navbar from '@/components/level-3/Navbar';
import Sidebar from '@/components/level-3/SideBar';
import { OrgProvider } from '@/context/OrgContext';

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <head>
        <title>Contessa</title>
      </head>
      <OrgProvider>
        <body className="font-sans antialiased flex flex-col">
          <Navbar />
          <div className="flex mt-[60px] min-h-screen">
            <Sidebar />
            <div className="overflow-y-auto w-full flex justify-center bg-[#f8f4f4] p-4">
              {children}
            </div>
          </div>
        </body>
      </OrgProvider>
    </html>
  );
}
