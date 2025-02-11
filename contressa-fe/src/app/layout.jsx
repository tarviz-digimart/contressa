import './globals.css';
import Navbar from '@/components/level-3/Navbar';
import { OrgProvider } from '@/context/OrgContext';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Contessa</title>
      </head>
      <body className="font-sans antialiased h-screen flex flex-col">
        <OrgProvider>
          <Navbar />
          <div className="mt-[60px] w-full h-full">{children}</div>
        </OrgProvider>
      </body>
    </html>
  );
}
