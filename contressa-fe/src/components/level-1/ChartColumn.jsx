import { Typography } from '@mui/material'
import React from 'react'
import WorkItemCard from './WorkItemCard';
import { useDroppable } from '@dnd-kit/core';

function ChartColumn({ columnName, items, id }) {

    const { setNodeRef } = useDroppable({
        id: id,
        data: {
            columnId: id
        }
    });

    return (
        <div className='w-[25%] bg-[#f1f1f1] flex flex-col items-start justify-start rounded-md p-2 flex-shrink-0 gap-y-2' ref={setNodeRef}
            style={{ boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.2)" }}
        >
            <div className='w-full bg-white h-[50px] text-center flex justify-center items-center border rounded-lg shadow-sm'>
                <Typography sx={{
                    fontWeight: "Medium"
                }} >
                    {columnName}
                </Typography>
            </div>
            <div className='flex flex-col items-start justify-start gap-y-2 w-full'>
                {items.map((item, index) => (
                    <WorkItemCard key={index} {...item} currentColumnId={id} index={index} />
                ))}
            </div>
        </div >
    )
}

export default ChartColumn