'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Button,
  Pagination,
  Tabs,
  Tab,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

const PAGE_SIZE = 5;

export default function UserTable({ users }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleSearchChange = (event) => setSearch(event.target.value.toLowerCase());
  const handleFilterChange = (event, newFilter) => setFilter(newFilter);

  const filteredUsers = users
    .filter((user) => {
      if (filter === 'Admins') return user.admin;
      if (filter === 'Members') return !user.admin;
      return true;
    })
    .filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.location.toLowerCase().includes(search)
    );

  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full max-w-4xl rounded-lg">
      <Tabs
        value={filter}
        onChange={handleFilterChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label={`All (${users.length})`} value="All" className='text-b2'/>
        <Tab label={`Members (${users.filter((u) => !u.admin).length})`} value="Members" className='text-b2'/>
        <Tab label={`Admins (${users.filter((u) => u.admin).length})`} value="Admins" className='text-b2'/>
      </Tabs>
      <div className="flex justify-between items-center mb-4 mt-2">
        <div className="relative w-1/3">
          <SearchIcon className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring"
          />
        </div>
        <Button variant="contained" className="bg-blue-500 text-white normal-case">
          Invite Members
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar>{user.name.charAt(0)}</Avatar>
                    <div>
                      <div className='flex'>
                        <p className="font-semibold">{user.name}</p>
                        {user.admin && (
                          <span className="bg-yellow-200 text-yellow-700 px-2 py-1 mx-2 -mt-0.5 rounded-lg text-xs bor">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-between items-center mt-4 px-4">
        <span className="text-gray-600">
          {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredUsers.length)} of{' '}
          {filteredUsers.length}
        </span>
        <Pagination
          count={Math.ceil(filteredUsers.length / PAGE_SIZE)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </div>
    </div>
  );
}
