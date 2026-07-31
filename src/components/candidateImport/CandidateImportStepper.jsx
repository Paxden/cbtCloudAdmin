/* eslint-disable no-unused-vars */
/**
 * Candidate Import Stepper Component
 * Step-by-step import workflow
 */

import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';

const STEPS = [
  {
    label: 'Select Examination',
    description: 'Choose the examination to import candidates into',
  },
  {
    label: 'Download Template',
    description: 'Download the template file with required fields',
  },
  {
    label: 'Upload File',
    description: 'Upload your candidate data file',
  },
  {
    label: 'Validate Records',
    description: 'Review validation results and fix errors',
  },
  {
    label: 'Preview Import',
    description: 'Preview the data before final import',
  },
  {
    label: 'Confirm Import',
    description: 'Confirm and complete the import process',
  },
];

const CandidateImportStepper = ({
  activeStep,
  onStepChange,
  onNext,
  onBack,
  onReset,
  loading,
  completed,
}) => {
  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      onNext();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      onBack();
    }
  };

  const handleReset = () => {
    onReset();
  };

  if (completed) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="success.main" gutterBottom>
          Import Completed Successfully!
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          All candidates have been imported. You can view them in the Candidates section.
        </Typography>
        <Button variant="contained" onClick={handleReset}>
          Start New Import
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {STEPS.map((step, index) => (
          <Step key={step.label} active={index === activeStep}>
            <StepLabel
              StepIconProps={{
                completed: index < activeStep,
                active: index === activeStep,
              }}
            >
              <Typography variant="subtitle2" fontWeight={index === activeStep ? 600 : 400}>
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography color="textSecondary" paragraph>
                {step.description}
              </Typography>

              {index === activeStep && (
                <Box sx={{ mt: 2 }}>
                  {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" color="textSecondary">
                        Processing...
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {index > 0 && (
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={loading}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading}
                    >
                      {index === STEPS.length - 1 ? 'Complete Import' : 'Next'}
                    </Button>
                    {index === 0 && (
                      <Button variant="text" onClick={handleReset}>
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === STEPS.length && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            All steps completed!
          </Typography>
          <Button variant="contained" onClick={handleReset}>
            Start New Import
          </Button>
        </Paper>
      )}
    </Paper>
  );
};

export default CandidateImportStepper;