'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import useApi from '@/utils/hooks/useApi';
import OtpFields from '@/components/level-1/OtpFields';
import { fontStyle } from '@/utils/styles/fontStyles';
import { logIn, verifyOTP, resendOTP } from '@/utils/api/apiURL';
import WorkItemModal from '@/components/level-2/workItemModal';
function page() {
  const style = fontStyle();
  const {
    data: LoginData,
    error: LoginError,
    loading: LoginLoading,
    execute: LoginExecute,
  } = useApi();
  const { data: OTPdata, error: OTPError, loading: OTPloading, execute: OTPExecute } = useApi();
  const { data: ResendOTPdata, error: ResendOTPError, execute: ResendOTPExecute } = useApi();

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [OTPscreen, setOTPscreen] = useState(false);
  const [OTPcode, setOTPcode] = useState();

  //Function for posting email and password
  const handleLogin = async (e) => {
    LoginExecute(logIn, 'POST', { organization_id: 1, email: email, password: password });
  };
  //on valid creds, set the pending token
  useEffect(() => {
    if (LoginData?.status === 200) {
      setOTPscreen(true);
      setOTPcode((prev) => ({ ...prev, pending_token: LoginData?.data.pending_token }));
    }
  }, [LoginData]);

  //Function to verify OTP
  const handleOTP = () => {
    OTPExecute(verifyOTP, 'POST', OTPcode);
  };
  //if OTP verified, routing to org page
  useEffect(() => {
    if (OTPdata?.status === 200) {
      router.push('organization');
    }
  }, [OTPdata]);

  //Fn to handle resendOTP
  const handleResetOTP = () => {
    ResendOTPExecute(resendOTP, 'POST', { email: email });
  };
  //On successfull resendOTP, update the pending token resigin in OTPdata state
  useEffect(() => {
    if (ResendOTPdata?.status === 200) {
      setOTPcode((prev) => ({ ...prev, pending_token: ResendOTPdata?.data.pending_token }));
    }
  }, [ResendOTPdata]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25rem]  pb-[5rem]">
        <div className="text-h1 text-center mb-4">
          {!OTPscreen ? (
            <p style={style.subHeading}>Login To Contressa</p>
          ) : (
            <p className="mb-10" style={style.subHeading}>
              Verification with OTP
            </p>
          )}
        </div>
        {OTPscreen && (
          <p className="text-nowrap mb-2">we have sent you the Verification code to your mail</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          {!OTPscreen ? (
            <>
              <div>
                <p className="heading" style={style.body}>
                  Email
                </p>
                <TextField
                  size="small"
                  // label="Email"
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
              </div>
              <div>
                <p style={style.body}>Password</p>
                <TextField
                  size="small"
                  // label="Password"
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
              </div>
              <div className="flex justify-between items-center ">
                <div className="w-full flex justify-end ">
                  <Button
                    variant="text"
                    className="text-b2 underline normal-case text-nowrap"
                    sx={{
                      ...style.caption,
                      color: 'black',
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
              <Button
                onClick={handleLogin}
                // type="submit"
                fullWidth
                variant="contained"
                className="normal-case"
                sx={{
                  ...style.body,
                  backgroundColor: '#5855d6',
                  '&:hover': { backgroundColor: '#4843c4' },
                }}
                disabled={LoginLoading}
              >
                {LoginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </>
          ) : (
            <>
              <OtpFields setOtpData={setOTPcode} />
              <div className="flex justify-between">
                <Button sx={{ textTransform: 'none' }} onClick={() => setOTPscreen(false)}>
                  Back
                </Button>
                <Button sx={{ textTransform: 'none' }} onClick={handleResetOTP}>
                  Resend OTP
                </Button>
              </div>
              <Button
                onClick={handleOTP}
                // type="submit"
                fullWidth
                variant="contained"
                className="normal-case"
                sx={{
                  backgroundColor: '#5855d6',
                  '&:hover': { backgroundColor: '#4843c4' },
                }}
                disabled={OTPloading}
              >
                {OTPloading ? 'Verifying...' : 'Verify'}
              </Button>
            </>
          )}

          {LoginError && (
            <p className="text-red-500 text-sm">{LoginError?.response?.data?.detail} </p>
          )}
          {OTPdata && <p className="text-green-500 text-sm">{OTPdata?.data.detail}</p>}
        </form>
      </div>
    </div>
  );
}

export default page;
