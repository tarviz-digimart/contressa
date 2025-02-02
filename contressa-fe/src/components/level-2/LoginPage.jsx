'use client';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import React from 'react';

function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-[25rem] m-5 bg-slate-200 p-10">
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'hide the password' : 'display the password'}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <div className="flex justify-end w-full">
        <Button
          sx={{
            textTransform: 'none',
            fontSize: '12px',
          }}
        >
          Forgot Password
        </Button>
      </div>
      <Button sx={{ textTransform: 'none', bgcolor: 'black', color: 'white' }} fullWidth>
        Login
      </Button>
      <Button sx={{ textTransform: 'none', bgcolor: 'black', color: 'white' }} fullWidth>
        SignUp
      </Button>
    </div>
  );
}

export default LoginPage;
