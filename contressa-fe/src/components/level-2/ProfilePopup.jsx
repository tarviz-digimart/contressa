"use client";

import { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRouter } from "next/navigation";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"; // ✅ Import the icon
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import fontStyles from "@/styles/fontStyles";

const ProfilePopup = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const menuItems = [
    {
      label: "Manage account",
      path: "/account",
      icon: <OpenInNewIcon fontSize="small" className="ml-2 text-gray-500" />,
    },
    { divider: true },
    { label: "Profile", path: "/profile" },
    { label: "Personal settings", path: "/settings" },
    { label: "Notifications", path: "/notifications", badge: "NEW" },
    { label: "Theme", path: "/theme" },
    { divider: true },
    { label: "Log out", path: "/logout", textClass: "text-red-500 text-b3" },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path = "") => {
    setAnchorEl(null);
    if (path) router.push(path); // ✅ Navigate after closing
  };

  return (
    <div className="relative inline-block text-left">
      <IconButton onClick={handleClick} size="small">
        <Avatar src="/path/to/avatar.jpg" alt="Darshan Kathiravan" />
        <ArrowDropDownIcon className="ml-1" />
      </IconButton>

      {/* popup component starting */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ className: "rounded-sm shadow-lg p-2 w-64" }}
      >
        <p className="ms-3 text-b1">Account</p>

        <div className="px-2 py-2 flex items-center space-x-2">
          <AccountCircleIcon className="text-gray-500 text-4xl" />
          <div>
            <h2 className="text-b2">DARSHAN KATHIRAVAN</h2>
            <p className="text-b1 text-gray-500">kathiravandarshan@gmail.com</p>
          </div>
        </div>

        {menuItems.map((item, index) =>
          item.divider ? (
            <Divider key={index} />
          ) : (
            <MenuItem
              key={index}
              onClick={() => handleClose(item.path)}
              className={`flex justify-between items-center text-b2 ${
                item.textClass || ""
              }`}
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
      </Menu>
    </div>
  );
};

export default ProfilePopup;
