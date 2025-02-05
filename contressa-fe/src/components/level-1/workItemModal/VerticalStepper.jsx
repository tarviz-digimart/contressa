import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For completed steps

const steps = [
  {
    label: 'Initiated',
  },
  {
    label: 'Installed',
  },
  {
    label: 'Feedback Collected',
  },
];

const CustomStepIcon = styled('div')(({ theme, ownerState }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: ownerState.completed ? '#4CAF50' : ownerState.active ? '#1976D2' : '#BDBDBD',
  color: '#fff',
  fontSize: '14px',
}));

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="flex w-full flex-col justify-center items-center gap-4">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon ownerState={props}>{props.icon}</CustomStepIcon>
                )}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {/* <Typography>{step.description}</Typography> */}
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ textTransform: 'none', mt: 1, mr: 1, w: '2rem' }}
                  >
                    {index === steps.length - 1 ? 'Continue' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ textTransform: 'none', mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {activeStep === steps.length && (
          <Button onClick={handleReset} sx={{ textTransform: 'none', mt: 1, mr: 1 }}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
