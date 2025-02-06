'use client';

import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AutoCompleteWithChips from '@/components/level-1/AutoCompleteWithChips';
import BasicSelect from '@/components/level-1/BasicSelect';
import AddIcon from '@mui/icons-material/Add';
import ChartColumn from '@/components/level-1/ChartColumn';
import {
  DndContext,
  MouseSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

function Page() {
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(MouseSensor),
    useSensor(PointerSensor)
  );

  const [columns, setColumns] = useState([
    {
      id: '1',
      name: 'To Do',
      items: [
        {
          taskId: '22',
          title: 'Design system update',
          category: 'AC Installation',
          completedStages: 1,
          totalStages: 5,
          assignees: [
            {
              name: 'Dinesh',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            },
            {
              name: 'Sarah',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            },
            {
              name: 'John',
              avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            },
          ],
          dueDate: 'Today',
          dueTime: '3:40 PM',
        },
      ],
    },
    {
      id: '2',
      name: 'In Review',
      items: [
        {
          taskId: '45',
          title: 'Backend API Integration',
          category: 'Software Development',
          completedStages: 3,
          totalStages: 7,
          assignees: [
            {
              name: 'Alice',
              avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
            },
            {
              name: 'Michael',
              avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
            },
            {
              name: 'Emma',
              avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
            },
          ],
          dueDate: 'Tomorrow',
          dueTime: '11:00 AM',
        },
      ],
    },
    {
      id: '3',
      name: 'Live',
      items: [
        {
          taskId: '78',
          title: 'Marketing Campaign Launch',
          category: 'Digital Marketing',
          completedStages: 5,
          totalStages: 5,
          assignees: [
            {
              name: 'Liam',
              avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
            },
            {
              name: 'Sophia',
              avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
            },
            {
              name: 'Noah',
              avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
            },
          ],
          dueDate: 'Friday',
          dueTime: '2:00 PM',
        },
      ],
    },
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Check if there's no valid drop target
    if (!over) return;

    // Find source and destination columns
    const sourceColumnId = active.data.current.columnId;
    const destinationColumnId = over.data.current.columnId;

    // If dropped in the same column, do nothing
    if (sourceColumnId === destinationColumnId) return;

    // Find source and destination columns in the state
    const sourceColumnIndex = columns.findIndex((col) => col.id === sourceColumnId);
    const destinationColumnIndex = columns.findIndex((col) => col.id === destinationColumnId);

    // Extract the dragged item from the source column
    const sourceItems = [...columns[sourceColumnIndex].items];
    const [movedItem] = sourceItems.splice(active.data.current.index, 1);

    // Add the item to the destination column
    const destinationItems = [...columns[destinationColumnIndex].items];
    destinationItems.splice(over.data.current.index || 0, 0, movedItem); // Drop at the top if no index

    // Update the columns in the state
    const updatedColumns = [...columns];
    updatedColumns[sourceColumnIndex].items = sourceItems;
    updatedColumns[destinationColumnIndex].items = destinationItems;

    setColumns(updatedColumns);
  };

  const handleDragStart = (event) => {
    console.log('Drag started:', event);
  };

  const handleDragOver = (event) => {
    console.log('Drag over:', event);
  };

  return (
    <div className="flex flex-col items-start justify-start p-10 h-full w-full gap-y-6">
      <Typography sx={{ fontWeight: 'bold' }}>KM Construction</Typography>

      <TextField
        variant="outlined"
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
      />

      <AutoCompleteWithChips />

      <div className="flex flex-row justify-between w-full">
        <div className="flex gap-x-2">
          <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
            Priority
          </Button>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
            Overdue
          </Button>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
            Deadline
          </Button>
        </div>

        <div className="flex justify-center items-center gap-x-2">
          <BasicSelect placeholder="Type" />
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: 'transparent',
              padding: '6px 12px',
              display: 'inline-flex',
              flexShrink: 0, // Prevent the button from stretching
            }}
          >
            Add Column
          </Button>
        </div>
      </div>
      <DndContext
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-row w-full h-full gap-x-10">
          {columns.map((column) => (
            <ChartColumn
              key={column.id}
              columnName={column.name}
              items={column.items}
              id={column.id}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default Page;
