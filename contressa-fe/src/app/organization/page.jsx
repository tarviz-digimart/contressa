'use client';

import Sidebar from '@/components/level-3/SideBar';
import UserTable from '@/components/level-3/organization/UserTable';
import React, { useState } from 'react';
import StyledTextField from '@/components/level-1/StyledTextField';
import OfficeCard from '@/components/level-3/organization/OfficeCard';
import HorizontalScroll from '@/components/level-1/HorizontalScroll';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { Button, TextField } from '@mui/material';
import DomainManager from '@/components/level-3/organization/DomainManager';

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
  const organizations = [
    {
      name: 'Tech Innovators Inc.',
      address: '123 Innovation Drive, Silicon Valley, CA',
      people: 50,
    },
    {
      name: 'Green Solutions Ltd.',
      address: '456 Eco Park, London, UK',
      people: 30,
    },
    {
      name: 'HealthPlus Corp.',
      address: '789 Wellness Way, New York, NY',
      people: 25,
    },
    {
      name: 'EduTech Global',
      address: '101 Learning Lane, Toronto, Canada',
      people: 40,
    },
    {
      name: 'Finance Wizards',
      address: '202 Money Street, Frankfurt, Germany',
      people: 60,
    },
    {
      name: 'Travel Ventures',
      address: '303 Adventure Ave, Sydney, Australia',
      people: 20,
    },
    {
      name: 'Foodies United',
      address: '404 Culinary Blvd, Paris, France',
      people: 15,
    },
    {
      name: 'Digital Creators Co.',
      address: '505 Creative St, Los Angeles, CA',
      people: 45,
    },
    {
      name: 'Smart Tech Solutions',
      address: '606 Tech Park, Berlin, Germany',
      people: 35,
    },
    {
      name: 'Eco-Friendly Products',
      address: '707 Green Way, Amsterdam, Netherlands',
      people: 28,
    },
    {
      name: 'Global Logistics Inc.',
      address: '808 Shipping Lane, Singapore',
      people: 50,
    },
  ];

  const initialDomains = ['ecosaver.com', 'tarviz.com'];

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} />
      <div className="flex flex-col w-full p-4 ms-64">
        <h1 className="my-4">Organization</h1>
        <div>
          <h2 className="mb-2">Name</h2>
          <StyledTextField className="w-1/2" placeholder="Contressa" />
        </div>
        <div>
          <h2 className="mt-4 mb-2">Description</h2>
          <div>
            <StyledTextField className="w-1/2" placeholder="Add Organization Description" />
          </div>
        </div>
        <div className='flex mt-4 mb-2  items-center'>
          <h2>Branches</h2>
          <p className='rounded-full text-b1 py-1 px-1.5 bg-blue-300 ms-2'>{organizations.length}</p>
        </div>
        <div className='w-[40rem]'>
          <HorizontalScroll Branches={organizations} />
        </div>
        <div className="my-5">
          <h2 className="mt-4 mb-2">Manage Domains</h2>
          <h3 className="mb-2">Allowed Domains</h3>
          <DomainManager initialDomains={initialDomains} />
        </div>
        <UserTable users={users} />
      </div>
    </div>
  );
}

export default page;
