import Sidebar from '@/components/level-3/SideBar';
import UserTable from '@/components/level-3/organization/UserTable';
import React from 'react';
import StyledTextField from '@/components/level-1/StyledTextField';

function page() {
  const users = [
    {
      name: 'Rohit Kumar',
      email: 'rohit@contressa.com',
      role: 'HR',
      location: 'Chennai',
      date: '7/29/2024',
      admin: true,
    },
    {
      name: 'Aswin',
      email: 'aswin@contressa.com',
      role: 'Manager',
      location: 'Mumbai',
      date: '7/29/2024',
      admin: false,
    },
    {
      name: 'Vishnu Kumar',
      email: 'vishnu@contressa.com',
      role: 'Customer..',
      location: 'Chennai',
      date: '7/29/2024',
      admin: true,
    },
    {
      name: 'Vishnu Kumar',
      email: 'vishnu@contressa.com',
      role: 'Designer',
      location: 'Chennai',
      date: '7/29/2024',
      admin: false,
    },
    {
      name: 'John Doe',
      email: 'john@contressa.com',
      role: 'Developer',
      location: 'Bangalore',
      date: '7/29/2024',
      admin: false,
    },
    {
      name: 'Jane Doe',
      email: 'jane@contressa.com',
      role: 'HR',
      location: 'Chennai',
      date: '7/29/2024',
      admin: false,
    },
  ];

  const menuItems = [
    { name: 'Members', route: '/members' },
    { name: 'Pending requests', route: '/pending-requests' },
    { name: 'Inventory', route: '/inventory' },
    { name: 'Sales', route: '/sales' },
    { name: 'Invoice', route: '/invoice' },
    { name: 'Performance', route: '/performance' },
  ];

  return (
    <div className='flex'>
      <Sidebar menuItems={menuItems} />
      <div className="flex flex-col w-full p-4 ms-64">
        <h1 className="text-h1 my-4">Organization</h1>
        <div>
          <h2 className="text-b3 font-bold mb-2">Name</h2>
          <StyledTextField className="w-72" placeholder="Contressa" />
        </div>
        <div className='mb-10'>
          <p className="text-b3 font-bold mt-4 mb-2">Description</p>
          <StyledTextField className="w-72" placeholder="Add Organization Description" />
        </div>
        <UserTable users={users} />
      </div>
    </div>
  );
}

export default page;
