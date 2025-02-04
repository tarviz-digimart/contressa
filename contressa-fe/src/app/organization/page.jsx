import Sidebar from '@/components/level-3/organization/SideBar';
import UserTable from '@/components/level-3/organization/UserTable';
import React from 'react';
import StyledTextField from '@/components/level-1/StyledTextField';

function page() {
  const users = [
    {
      name: 'Rohit Kumar',
      email: 'rohit@victopialabs.com',
      role: 'HR',
      location: 'Chennai',
      date: '7/29/2024',
      admin: true,
    },
    {
      name: 'Aswin',
      email: 'aswin@victopialabs.com',
      role: 'Manager',
      location: 'Mumbai',
      date: '7/29/2024',
      admin: false,
    },
    {
      name: 'Vishnu Kumar',
      email: 'vishnu@victopialabs.com',
      role: 'Customer..',
      location: 'Chennai',
      date: '7/29/2024',
      admin: true,
    },
    {
      name: 'Vishnu Kumar',
      email: 'vishnu@victopialabs.com',
      role: 'Designer',
      location: 'Chennai',
      date: '7/29/2024',
      admin: false,
    },
    {
      name: 'John Doe',
      email: 'john@victopialabs.com',
      role: 'Developer',
      location: 'Bangalore',
      date: '7/29/2024',
      admin: false,
    },
    {
      name: 'Jane Doe',
      email: 'jane@victopialabs.com',
      role: 'HR',
      location: 'Chennai',
      date: '7/29/2024',
      admin: false,
    },
  ];
  return (
    <div className="ms-64 xl:ms-80 flex justify-center">
      <Sidebar />
      <div className="flex flex-col w-full p-4">
        <h1 className="text-h1 my-4">Organization</h1>
        <div>
          <h2 className="text-b3 font-bold mb-2">Name</h2>
          <StyledTextField className="w-72" placeholder="Victopia Labs" />
        </div>
        <div className='mb-10'>
          <h2 className="text-b3 font-bold mt-4 mb-2">Description</h2>
          <StyledTextField className="w-72" placeholder="Add Organization Description" />
        </div>
        <UserTable users={users} />
      </div>
    </div>
  );
}

export default page;
