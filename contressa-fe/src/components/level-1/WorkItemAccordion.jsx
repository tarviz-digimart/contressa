'use Client';
import * as React from 'react';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import BasicSelect from './BasicSelect';
import VerticalLinearStepper from './workItemModal/VerticalStepper';

const DropdownField = ({ label, placeholder, data, onChange, avatar }) => (
  <div className="flex gap-2 items-center w-full">
    <p className="font-bold text-[15px] w-[15rem]">{label}</p>
    <BasicSelect data={data} placeholder={placeholder} avatar={avatar} onChange={onChange} />
  </div>
);

export default function StyledAccordion() {
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
    { id: 1, value: 10 },
    { id: 2, value: 20 },
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
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Details
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <DropdownField
            label="Assigner"
            placeholder="Select Assigner"
            value={selections.assignee}
            data={assigneeData}
            onChange={(value) => handleSelectionChange('assignee', value)}
            avatar
          />

          <DropdownField
            label="Assignee"
            placeholder="Select Assignee"
            value={selections.assignedTo}
            data={assigneeData}
            onChange={(value) => handleSelectionChange('assignedTo', value)}
            avatar
          />

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
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
