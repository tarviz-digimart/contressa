import './globals.css'; // If you have global styles

export const metadata = {
  title: 'Task Management',
  description: 'Task Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <div className="min-h-screen bg-gray-50">
            {/* Preserve your existing layout structure */}
            {children}
          </div>
      </body>
    </html>
  );
} 