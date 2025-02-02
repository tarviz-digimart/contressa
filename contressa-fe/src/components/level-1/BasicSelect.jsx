import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Avatar } from '@mui/material';

const getAvatarColor = (name) => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4A261', '#2A9D8F'];
  if (!name || name === 'None') return '#BDBDBD'; // Default gray color for "None"
  const index = name.charCodeAt(0) % colors.length; // Get color based on first letter
  return colors[index];
};

export default function BasicSelect({ data, onChange, onClose, placeholder, avatar = false }) {
  const [selectedData, setSelectedData] = React.useState('None');

  const handleChange = (event) => {
    setSelectedData(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
    if (onClose) {
      onClose(); // Close dropdown after selection
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <Select
          id="demo-simple-select"
          value={selectedData}
          onChange={handleChange}
          onClose={onClose} // Close dropdown when clicking outside
          displayEmpty // Ensures the placeholder is visible when nothing is selected
          renderValue={(selected) => {
            // Only show the selected value, or the placeholder when no selection
            if (!selected || selected === 'None') {
              return <span className="text-slate-500">{placeholder || 'Select'}</span>;
            }
            return (
              <div className="flex gap-2 items-center">
                {' '}
                {avatar && (
                  <Avatar
                    sx={{
                      bgcolor: getAvatarColor(selected),
                      width: 34,
                      height: 34,
                    }}
                  >
                    {selected?.[0]}
                  </Avatar>
                )}
                {selected}
              </div>
            );
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
        >
          {data?.map((item) => (
            <MenuItem key={item.id} value={item.value} className="flex gap-x-3">
              <div className="flex items-center gap-2">
                {avatar && (
                  <Avatar sx={{ bgcolor: getAvatarColor(item.value), width: 34, height: 34 }}>
                    {item.value?.[0]}
                  </Avatar>
                )}
                {item.value}
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
