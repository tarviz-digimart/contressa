import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function LimitTags() {
  return (
    <div className="w-full">
      <Autocomplete
        multiple
        limitTags={3}
        id="multiple-limit-tags"
        options={names}
        getOptionLabel={(option) => option.name}
        // defaultValue={[names[13], names[12], names[11]]}
        renderInput={(params) => <TextField {...params} label="" placeholder="Select Assigner" />}
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
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const names = [
  { name: 'Kevin' },
  { name: 'Emily' },
  { name: 'Josh' },
  { name: 'Adam' },
  { name: 'Vikram' },
  { name: 'Sid' },
];
