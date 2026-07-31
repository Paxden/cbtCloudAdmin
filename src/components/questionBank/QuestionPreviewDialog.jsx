/**
 * Question Preview Dialog Component
 * Renders question as candidates will see it
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, DesktopWindows, TabletAndroid, PhoneAndroid } from '@mui/icons-material';
import { useState } from 'react';

const QuestionPreviewDialog = ({
  open,
  question,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState('desktop');

  if (!question) return null;

  const handleViewModeChange = (event, newMode) => {
    if (newMode) setViewMode(newMode);
  };

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Question Preview</Typography>
          <Typography variant="caption" color="textSecondary">
            {question.questionCode}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* View Mode Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Chip label={question.status} size="small" color="primary" />
            <Chip label={`${question.marks || 0} marks`} size="small" variant="outlined" />
            <Chip label={question.questionTypeId?.name || 'N/A'} size="small" variant="outlined" />
          </Stack>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="desktop">
              <DesktopWindows fontSize="small" />
            </ToggleButton>
            <ToggleButton value="tablet">
              <TabletAndroid fontSize="small" />
            </ToggleButton>
            <ToggleButton value="mobile">
              <PhoneAndroid fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Preview Content */}
        <Box
          sx={{
            maxWidth: getPreviewWidth(),
            margin: '0 auto',
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            minHeight: 200,
          }}
        >
          {/* Question Text */}
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {question.questionText?.replace(/<[^>]*>/g, '') || 'No content'}
          </Typography>

          {/* Options */}
          {question.options && question.options.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Stack spacing={1}>
                {question.options.map((option) => (
                  <Box
                    key={option.id}
                    sx={{
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {option.id}.
                    </Typography>
                    <Typography variant="body2">{option.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* True/False */}
          {question.questionTypeId?.code === 'TRUE_FALSE' && (
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Chip label="True" variant="outlined" />
              <Chip label="False" variant="outlined" />
            </Box>
          )}

          {/* Fill in the Blank */}
          {question.questionTypeId?.code === 'FILL_BLANK' && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  p: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  Type your answer here...
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionPreviewDialog;