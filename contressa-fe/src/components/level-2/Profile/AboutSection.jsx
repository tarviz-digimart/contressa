import React from 'react';
import { Avatar, Button, Divider } from '@mui/material';
import { MdOutlineWork, MdEmail } from 'react-icons/md';
import { HiOfficeBuilding } from 'react-icons/hi';
import { IoIosGitNetwork } from 'react-icons/io';
import { FaLocationArrow, FaPhone } from 'react-icons/fa';

function AboutSection({ ProfileData }) {
  const details = [
    { icon: MdOutlineWork, text: 'Your Job Title' },
    { icon: IoIosGitNetwork, text: 'Your Department' },
    { icon: HiOfficeBuilding, text: 'Your Organisation' },
    { icon: FaLocationArrow, text: 'Your Location' },
  ];
  return (
    <div>
      <div className="place-items-center">
        <Avatar
          src="https://via.placeholder.com/150"
          sx={{ width: 120, height: 120 }}
          className="mb-4"
        />
        <p variant="h5" className="font-bold mb-4">
          {ProfileData.name}
        </p>
        <Button className="bg-gray-200 text-black text-b1 w-64">Manage your account</Button>
      </div>
      <div className="space-y-4 mt-4 text-left shadow-lg p-4 text-gray-500 text-b2">
        <p className="text-b1">About</p>
        <div>
          {details.map(({ icon: Icon, text }, index) => (
            <div key={index} className="flex items-center my-8">
              <Icon className="mr-2 text-xl" />
              <p>{text}</p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <Divider sx={{ backgroundColor: 'white' }} />
        <p variant="subtitle2" className="">
          Contact
        </p>
        <div className="flex items-center">
          <MdEmail className="mr-2 text-xl" />
          <p>{ProfileData.email}</p>
        </div>
        <div className="flex items-center">
          <FaPhone className="mr-2 text-lg" />
          <p>{ProfileData.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
