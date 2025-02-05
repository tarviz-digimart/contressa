"use client"

import { useRef } from 'react';
import { Avatar, MenuItem, Divider, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePopup = ({ isOpen, handleClose, ref }) => {
  const router = useRouter();

  const menuItems = [
    {
      label: 'Manage account',
      path: '',
      icon: <OpenInNewIcon fontSize="small" className="ml-2 text-gray-500" />,
    },
    { divider: true },
    { label: 'Profile', path: '/profile' },
    { label: 'Personal settings', path: '' },
    // { label: 'Notifications', path: '', badge: 'NEW' },
    { label: 'Theme', path: '' },
    { divider: true },
    { label: 'Log out', path: '', textClass: 'text-red-500 text-b3' },
  ];

  const handleNavigation = (path) => {
    handleClose();
    if (path) router.push(path);
  };

  if (!isOpen) return null;

  return (
    <Paper
      ref={ref}
      className="absolute top-12 right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10"
    >
      <Typography variant="h6" className="mb-3 text-b1">
        Account
      </Typography>
      <div className="flex items-center space-x-2 pb-4 border-b">
        <AccountCircleIcon className="text-gray-500 text-4xl" />
        <div>
          <Typography variant="subtitle1" className="text-b2">
            DARSHAN KATHIRAVAN
          </Typography>
          <Typography variant="body2" className="text-b1 text-gray-500">
            kathiravandarshan@gmail.com
          </Typography>
        </div>
      </div>

      {menuItems.map((item, index) =>
        item.divider ? (
          <Divider key={index} className="my-2" />
        ) : (
          <MenuItem
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex justify-between items-center text-b2 py-2 ${item.textClass || ''}`}
          >
            <span>{item.label}</span>
            {item.icon}
            {item.badge && (
              <span className="ml-2 text-xs bg-purple-200 text-purple-800 px-1 rounded">
                {item.badge}
              </span>
            )}
          </MenuItem>
        )
      )}
    </Paper>
  );
};

export default ProfilePopup;
