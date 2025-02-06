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
        localStorage.setItem('token', response.data.token); // Store token
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
        <h2 className="text-h1 text-center mb-4">Login to Contressa</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <p className="text-b3 font-medium">Email</p>
          <TextField
            size="small"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-b3 font-medium">Password</p>
          <TextField
            size="small"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between">
            <div className="flex">
              <Checkbox />
              <p className="text-b2 mt-3 -ms-2">Remember me</p>
            </div>
            <p className="text-b2 mt-3">Forgot password?</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={() => router.push('/organization')}
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#5855d6',
              '&:hover': { backgroundColor: '#4843c4' },
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Don’t have an account?{' '}
            <a href="/signup" className="text-[#5855d6]">
              Signup
            </a>
          </p>
        </div>

        <div className="flex items-center justify-center my-4">
          <hr className="w-1/3 border-gray-300" />
          <p className="mx-2 text-gray-600">or</p>
          <hr className="w-1/3 border-gray-300" />
        </div>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center text-black text-b1 font-semibold border-black"
        >
          <img
            width="20"
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="google-logo"
            className="mr-2"
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
