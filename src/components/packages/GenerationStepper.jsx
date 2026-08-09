/**
 * GenerationStepper Component
 * Displays wizard steps
 * 
 * Location: src/components/packages/GenerationStepper.jsx
 */

import { Stepper, Step, StepLabel, StepContent, Paper, Box } from '@mui/material';

const STEPS = [
  { label: 'Select Instance', description: 'Choose an examination instance' },
  { label: 'Select Centres', description: 'Choose centres for package generation' },
  { label: 'Review', description: 'Review generation settings' },
  { label: 'Generate', description: 'Generate secure CBTX packages' },
  { label: 'Completed', description: 'Generation complete' }
];

const GenerationStepper = ({
  activeStep,
  children,
  orientation = 'vertical'
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Stepper
        activeStep={activeStep}
        orientation={orientation}
        sx={{
          '& .MuiStepConnector-line': {
            minHeight: 20
          }
        }}
      >
        {STEPS.map((step, index) => (
          <Step key={step.label} completed={activeStep > index}>
            <StepLabel>
              <Box>
                <Box sx={{ fontWeight: 500 }}>{step.label}</Box>
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {step.description}
                </Box>
              </Box>
            </StepLabel>
            <StepContent>
              <Box sx={{ mt: 2, mb: 2 }}>
                {children && index === activeStep && children}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default GenerationStepper;