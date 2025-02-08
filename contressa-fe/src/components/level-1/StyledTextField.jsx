import { TextField, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function StyledTextField({ value, label, onChange, className, placeholder }) {
  return (
    <div className={className}>
      <TextField
        variant="outlined"
        placeholder={placeholder}
        size="small"
        label={label}
        value={value}
        onChange={onChange}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <EditIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
