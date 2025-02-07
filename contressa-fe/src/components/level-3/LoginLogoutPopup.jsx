import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { Close } from '@mui/icons-material';

const LoginLogoutPopup = ({ open, handleClose, handleLogin, L }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');

  // Predefined list of available tasks
  const availableTasks = [
    { id: 1, text: 'To create a login page' },
    { id: 2, text: 'To design dashboard' },
    { id: 3, text: 'To implement authentication' },
    { id: 4, text: 'To create user profile page' },
    // Add more predefined tasks as needed
  ];

  // Modify the dropdown change handler to add tasks immediately
  const handleTaskChange = (e) => {
    const taskId = e.target.value;
    if (taskId) {
      const taskToAdd = availableTasks.find((task) => task.id === parseInt(taskId));
      if (taskToAdd && !selectedTasks.some((task) => task.id === taskToAdd.id)) {
        setSelectedTasks([...selectedTasks, taskToAdd]);
      }
      setSelectedTask('');
    }
  };

  const handleRemoveTask = (id) => {
    setSelectedTasks(selectedTasks.filter((task) => task.id !== id));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="p-4">
          {/* Profile Section */}
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
              D
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Darshan</h2>
              <p className="text-gray-600 text-sm">Employee ID: E323P1234</p>
            </div>
            <p className="ml-auto text-gray-700">Thursday, Feburary 6, 2025</p>
          </div>

          {/* Status Section */}
          <div className="flex items-center mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
            <h3 className="text-lg font-semibold">Status: Active</h3>
            <p className="ml-auto text-gray-700">01:00:23</p>
          </div>

          {/* Task Dropdown - removed Add button and modified onChange */}
          <h3 className="text-h1 my-3">Task</h3>   
          <div className="flex gap-2 mb-4">
            <select
              value={selectedTask}
              onChange={handleTaskChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select a task</option>
              {availableTasks
                .filter((task) => !selectedTasks.some((selected) => selected.id === task.id))
                .map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.text}
                  </option>
                ))}
            </select>
          </div>

          {/* Selected Tasks List */}
          <ul className="space-y-2">
            {selectedTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between rounded-md">
                <div className="flex items-center">
                  <IoCheckmarkDoneCircleSharp className="text-[#2357c7] text-2xl" />
                  <span className="text-[#2357c7] text-bold text-3xl -mt-1.5 me-4">-</span>
                  <span>{task.text}</span>
                </div>
                <button onClick={() => handleRemoveTask(task.id)} className="text-gray-300">
                  <IoIosRemoveCircleOutline size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<IoArrowBackCircleOutline />}
          className="w-full py-2 text-black text-b3 font-bold"
          sx={{ textTransform: 'none', border: '1px solid #e0e0e0' }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginLogoutPopup;
