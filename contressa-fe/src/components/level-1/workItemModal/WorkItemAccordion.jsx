'use Client';
import * as React from 'react';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import BasicSelect from '../BasicSelect';
import VerticalLinearStepper from './VerticalStepper';
import LimitTags from '../LimitTags';
import { TextField } from '@mui/material';

const DropdownField = ({ label, placeholder, data, onChange, avatar }) => (
  <div className="flex gap-2 items-center w-full ">
    <p className="font-bold text-lg w-[15rem]">{label}</p>
    <BasicSelect data={data} placeholder={placeholder} avatar={avatar} onChange={onChange} />
  </div>
);

const MultiSelect = () => (
  <div className="flex gap-2 items-center w-full">
    <p className="font-bold text-lg w-[15rem]">Assignee</p>
    <LimitTags />
  </div>
);
const CustomTextField = () => (
  <div className="flex gap-2 items-center w-full">
    <p className="font-bold text-lg w-[15rem]">Project Name</p>
    <div className="w-full">
      <TextField
        fullWidth
        placeholder="Enter Project Name"
        InputProps={{
          sx: {
            fontWeight: 'bold',
            fontSize: '18px',
          },
        }}
        sx={{
          height: '50px',
          fontSize: 15,
          border: 'none', // Remove border completely
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent', // Make the outline transparent
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent', // Remove the border on hover
          },
          '& .MuiSelect-select': {
            paddingLeft: '8px', // Optional: Adds padding if you need space from the left edge
          },
        }}
      />
    </div>
  </div>
);

export default function WorkItemAccordion() {
  const [selections, setSelections] = useState({
    assignee: '',
    assignedTo: '',
    parent: '',
    label: '',
  });

  const handleSelectionChange = (key, value) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const data = [
    { id: 1, value: 'TCS' },
    { id: 2, value: 'Tata' },
  ];
  const labelData = [
    { id: 1, value: 'Cleaning' },
    { id: 2, value: 'Drying' },
  ];
  const assigneeData = [
    { id: 1, value: 'John' },
    { id: 2, value: 'Wayne' },
    { id: 3, value: 'Kevin' },
  ];

  return (
    <div>
      <div className="p-5">
        <div>
          <p className="font-bold text-lg" component="span">
            Details
          </p>
        </div>
        <Divider />
        <div className="flex flex-col gap-4 pt-4">
          <CustomTextField />
          <DropdownField
            label="Assigner"
            placeholder="Select Assigner"
            value={selections.assignedTo}
            data={assigneeData}
            onChange={(value) => handleSelectionChange('assignedTo', value)}
            avatar
          />
          <MultiSelect />
          <DropdownField
            label="Parent"
            placeholder="Select Parent"
            value={selections.parent}
            data={data}
            onChange={(value) => handleSelectionChange('parent', value)}
          />

          <DropdownField
            label="Label"
            placeholder="Select Label"
            value={selections.label}
            data={labelData}
            onChange={(value) => handleSelectionChange('label', value)}
          />
          <Divider />
          <div className="flex items-center justify-center">
            <VerticalLinearStepper />
          </div>
        </div>
      </div>
    </div>
  );
}
