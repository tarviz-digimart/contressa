import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Avatar, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import WorkItemModal from '@/components/level-2/workItemModal';

function WorkItemCard({
    taskId,
    title,
    category,
    completedStages,
    totalStages,
    assignees,
    dueDate,
    dueTime,
    currentColumnId,
    index,
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: taskId,
        data: {
            columnId: currentColumnId,  // Pass the current column ID as prop
            index: index         // Pass index for tracking position
        }
    });

    const [open, setOpen] = useState(false);

    const style = {
        transform: CSS.Translate.toString(transform),
        touchAction: 'none',
    };

    const handleWorkItemModalOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Card
                className="w-full border rounded-lg shadow-sm"
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                onClick={handleWorkItemModalOpen}
            >
                <CardContent className="flex flex-col gap-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-x-2">
                        <Typography variant="subtitle2" className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                            #{taskId}
                        </Typography>
                        <Typography variant="h6" className="font-medium text-gray-800">
                            {title}
                        </Typography>
                    </div>

                    {/* Category Tag */}
                    <Chip
                        label={category}
                        variant="outlined"
                        size="small"
                        className="text-gray-600 border-gray-300"
                    />

                    {/* Progress */}
                    <Typography variant="body2" className="text-gray-600">
                        {completedStages}/{totalStages} stages completed
                    </Typography>

                    <div className='flex w-full justify-between items-center'>
                        {/* Assignees */}
                        <div className="flex items-center gap-x-2 mt-2">
                            <div className="flex -space-x-2">
                                {assignees.slice(0, 3).map((assignee, index) => (
                                    <Tooltip key={index} title={assignee.name}>
                                        <Avatar
                                            alt={assignee.name}
                                            src={assignee.avatar}
                                            sx={{ width: 30, height: 30, fontSize: '0.8rem' }}
                                        />
                                    </Tooltip>
                                ))}
                            </div>
                            <Typography variant="body2" className="text-gray-700">
                                {assignees[0]?.name}{assignees.length > 1 && `, +${assignees.length - 1}`}
                            </Typography>
                        </div>

                        {/* Due Date & Time */}
                        <div className="flex items-center text-orange-500 gap-x-1 mt-1">
                            <AccessTimeIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2">{dueDate}, {dueTime}</Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <WorkItemModal open={open} setOpen={setOpen} />
        </>
    );
}

export default WorkItemCard;
