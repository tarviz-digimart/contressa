'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineDashboard } from 'react-icons/md';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';
import ProfilePopup from '../level-2/ProfilePopup';
import LoginLogoutPopup from './LoginLogoutPopup';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { IconButton } from '@mui/material';

function Navbar() {
  const pathname = usePathname();
  const isRoot = pathname === '/';
  const router = useRouter();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const [isLoginOpen, setLoginOpen] = useState(false); // Add this state
  const [Login, setLogin] = useState(false);

  const handleLoginClose = () => {
    setLoginOpen(false);
    setLogin(true);
  };

  const handleLogin = () => {
    setLogin(false);
  };

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
  console.log('isProfileOpen:', isProfileOpen);

  return (
    <div className="bg-[#282828] fixed top-0 h-[4rem] z-10 border-gray-200 dark:bg-gray-900 w-full">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Left Side */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <MdOutlineDashboard className="text-white" size={24} />
          <p className="text-lg font-semibold text-white">Contressa</p>
        </div>
        {!isRoot && (
          <>
            {/* Right Side - Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Task', path: '/task' },
                { name: 'Attendance', path: '/attendance' },
                { name: 'Inventory', path: 'inventory' },
                { name: 'Sales', path: '/sales' },
                { name: 'Payroll', path: '/payroll' },
              ].map((item) => (
                <p
                  key={item.path}
                  className={`cursor-pointer p-2 rounded-full min-w-[100px] text-center transition-all duration-300 ${
                    pathname === item.path
                      ? 'text-black font-medium bg-white'
                      : 'text-white hover:text-slate-200'
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  {item.name}
                </p>
              ))}
            </div>
          </>
        )}
        {!isRoot && (
          <div className="flex items-center space-x-6 relative">
            <div className="relative cursor-pointer" onClick={() => setNotifOpen(!isNotifOpen)}>
              <IoNotificationsOutline className="text-white" size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>
            <IconButton>
              <CorporateFareIcon
                style={{ color: 'white' }}
                onClick={() => router.push('/organization')}
              />
            </IconButton>
            {/* Profile Icon */}
            <div className="cursor-pointer" onClick={() => setProfileOpen((prev) => !prev)}>
              <FaRegUserCircle className="text-white" size={24} />
            </div>

            {/* Profile Popup */}
            {isProfileOpen && (
              <ProfilePopup ref={profileRef} isOpen={isProfileOpen} handleClose={handleClose} />
            )}
            <LoginLogoutPopup
              open={isLoginOpen}
              handleClose={handleLoginClose}
              handleLogin={handleLogin}
              Login={Login}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
