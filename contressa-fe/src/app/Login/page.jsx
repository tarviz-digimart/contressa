'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', { email, password });

      if (response.data.success) {
        // localStorage.setItem('token', response.data.token); // Store token
        router.push('/dashboard'); // Redirect on success
      }
    } catch (err) {
      // setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <p className="text-h1 text-center mb-4">Login To Contressa</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            size="small"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'black', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black', // Border color when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'black', // Default label color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black', // Label color when focused
              },
            }}
          />

          <TextField
            size="small"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'black', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black', // Border color when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'black', // Default label color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black', // Label color when focused
              },
            }}
          />
          <div className="flex justify-between items-center ">
            <div className="flex w-full">
              <Checkbox />
              <p className="text-b2 mt-3 -ms-2">Remember me</p>
            </div>
            <div className="w-full flex justify-end mb-2 pr-2">
              <Button
                variant="text"
                className="text-b2 mt-3 underline normal-case"
                sx={{
                  color:'black',
                  textTransform: 'none',
                  textDecoration: 'underline !important', // Force underline
                  '&:hover': {
                    backgroundColor: 'inherit !important', // No background change on hover
                    boxShadow: 'none', // No shadow on hover
                  },
                }}
              >
                Forgot password?
              </Button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={() => router.push('/organization')}
            type="submit"
            fullWidth
            variant="contained"
            className="normal-case"
            sx={{
              backgroundColor: '#5855d6',
              '&:hover': { backgroundColor: '#4843c4' },
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
