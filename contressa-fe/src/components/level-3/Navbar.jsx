'use client';
// Navbar component
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineDashboard } from 'react-icons/md';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';
import ProfilePopup from '../level-2/ProfilePopup';

function Navbar() {
  const pathname = usePathname();
  const isRoot = pathname === '/';
  const router = useRouter();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);

  const handleClose = () => {
    setNotifOpen((prev) => !prev);
  };

  // Close profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  console.log('ROOT', isRoot);
  if (isRoot) {
    return <></>;
  }
  return (
    <nav className="bg-white fixed top-0 z-10  border-gray-200 dark:bg-gray-900 w-full">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Left Side */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <MdOutlineDashboard size={24} />
          <p className="text-lg font-semibold">Task Manager asdfasdf</p>
        </div>

        {/* Right Side - Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: 'Organization', path: '/organization' },
            { name: 'Projects', path: '/projects' },
            { name: 'Dashboard', path: '' },
          ].map((item) => (
            <p
              key={item.path}
              className={`cursor-pointer ${
                pathname === item.path
                  ? 'text-blue-700 font-medium'
                  : 'text-gray-900 hover:text-blue-700'
              }`}
              onClick={() => router.push(item.path)}
            >
              {item.name}
            </p>
          ))}
        </div>

        <div className="flex items-center space-x-6 relative">
          {/* Notification Icon */}
          <div className="relative cursor-pointer" onClick={() => setNotifOpen(!isNotifOpen)}>
            <IoNotificationsOutline size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>

          {/* Profile Icon */}
          <div className="cursor-pointer" onClick={() => setProfileOpen(!isProfileOpen)}>
            <FaRegUserCircle size={24} />
          </div>

          {/* Profile Popup */}
          {isProfileOpen && (
            <ProfilePopup ref={profileRef} isOpen={isProfileOpen} handleClose={handleClose} />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
