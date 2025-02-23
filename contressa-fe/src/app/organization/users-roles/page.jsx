'use client';

import { useState } from 'react';
import { fontStyle } from '@/utils/styles/fontStyles';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
const NewLevelDialog = ({ open, setOpen, setLevelName, addNewLevel }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box sx={{ width: '30rem' }}>
        <DialogTitle>{'Create New Hierarchy Level'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Enter new level title"
            onChange={(e) => setLevelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addNewLevel} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const NewRoleDialog = ({ open, setRoleDialogOpen, setRoleName, addNewRole }) => {
  const handleClose = () => {
    setRoleDialogOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ width: '30rem' }}>
        <DialogTitle id="alert-dialog-title">{'Create New Role'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Enter new role"
            onChange={(e) => setRoleName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ textTransform: 'none' }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            sx={{ textTransform: 'none', bgcolor: '#2b9bec', color: 'white' }}
            onClick={addNewRole}
            autoFocus
          >
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default function RoleHierarchy() {
  const [open, setOpen] = useState(false);
  const [levelName, setLevelName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [levels, setLevels] = useState([
    {
      name: 'Owner',
      roles: [],
      id: 1,
      level: 1,
    },
  ]);
  console.log('levels:', levels);
  // Function to add a new level
  const addNewLevel = () => {
    if (!levelName.trim()) return;

    let updatedLevels;
    const newLevel = { name: levelName, roles: [] };

    if (selectedLevelId !== null) {
      // Insert the new level above the selected level
      const index = levels.findIndex((level) => level.id === selectedLevelId);
      updatedLevels = [...levels.slice(0, index), newLevel, ...levels.slice(index)];
    } else {
      // Append to the bottom if no selection
      updatedLevels = [...levels, newLevel];
    }

    // Recalculate IDs to maintain order
    updatedLevels = updatedLevels.map((level, index) => ({ ...level, id: index + 1 }));

    setLevels(updatedLevels);
    setLevelName('');
    setOpen(false);
    setSelectedLevelId(null);
  };

  // Function to add a new role to the selected level
  const addNewRole = () => {
    if (!roleName.trim() || selectedLevelId === null) return;

    setLevels((prevLevels) =>
      prevLevels.map((level) =>
        level.id === selectedLevelId ? { ...level, roles: [...level.roles, roleName] } : level
      )
    );

    // Reset input and close dialog
    setRoleName('');
    setSelectedLevelId(null);
    setRoleDialogOpen(false);
  };

  return (
    <div className="p-6 w-full">
      <p className="text-xl font-bold">Roles Hierarchy Management</p>
      <p className="text-gray-600">Manage your organization role hierarchy and permissions.</p>

      <div className="my-4 w-full">
        {/* <div className="border p-4 mb-4 rounded-lg shadow-sm bg-white flex justify-between">
          <div className="flex gap-5 items-center">
            <p className="font-semibold bg-slate-200 p-2 rounded-md">Level 1</p>
            <p className="text-lg font-medium">Owner</p>
          </div>
          <IconButton
            onClick={() => {
              setSelectedLevelId(1);
              setOpen(true);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </div> */}

        {levels.map((level) => (
          <div key={level.id} className="border p-4 mb-4 rounded-lg shadow-sm bg-white">
            <div className="flex justify-between">
              <div className="flex items-center gap-5">
                <p className="font-semibold bg-slate-200 p-2 rounded-md">Level {level.id}</p>
                <p className="text-lg font-medium">{level.name}</p>
              </div>
              {level.id !== 1 && (
                <IconButton
                  onClick={() => {
                    setSelectedLevelId(level.id);
                    setOpen(true);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {level.roles.map((role, index) => (
                <div
                  key={index}
                  className="border px-3  rounded-md bg-gray-100 flex items-center gap-5"
                >
                  {role}
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </div>
              ))}
              {level.id !== 1 && (
                <button
                  onClick={() => {
                    setSelectedLevelId(level.id);
                    setRoleDialogOpen(true);
                  }}
                  className="border px-3 py-2 rounded-md text-black hover:bg-gray-200"
                >
                  + Add New Role
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setSelectedLevelId(null); // Ensure it's a normal add
          setOpen(true);
        }}
        className="w-full border px-4 py-2 rounded-md text-blue-500 bg-white hover:bg-gray-200"
      >
        + Add New Level
      </button>

      <NewLevelDialog
        open={open}
        setOpen={setOpen}
        setLevelName={setLevelName}
        addNewLevel={addNewLevel}
      />
      <NewRoleDialog
        open={roleDialogOpen}
        setRoleName={setRoleName}
        setRoleDialogOpen={setRoleDialogOpen}
        addNewRole={addNewRole}
      />
    </div>
  );
}
