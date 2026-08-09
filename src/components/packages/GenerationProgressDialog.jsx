/* eslint-disable no-unused-vars */
/**
 * GenerationProgressDialog Component
 * Displays live generation progress
 * 
 * Location: src/components/packages/GenerationProgressDialog.jsx
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  HourglassEmpty as PendingIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const GENERATION_STAGES = [
  { id: 'preparing', label: 'Preparing Instance' },
  { id: 'generating_papers', label: 'Generating Candidate Papers' },
  { id: 'randomizing_questions', label: 'Randomizing Questions' },
  { id: 'randomizing_options', label: 'Randomizing Options' },
  { id: 'encrypting_questions', label: 'Encrypting Questions' },
  { id: 'encrypting_candidates', label: 'Encrypting Candidates' },
  { id: 'signing', label: 'Generating Digital Signature' },
  { id: 'checksum', label: 'Generating SHA-256 Checksum' },
  { id: 'building_package', label: 'Building CBTX Package' },
  { id: 'validation', label: 'Running Validation' },
  { id: 'completed', label: 'Completed' }
];

const GenerationProgressDialog = ({
  open,
  onClose,
  onCancel,
  progress = 0,
  currentStageId = null,
  status = null,
  isGenerating = true
}) => {
  const getStageStatus = (stageId) => {
    const stageIndex = GENERATION_STAGES.findIndex(s => s.id === stageId);
    const currentIndex = GENERATION_STAGES.findIndex(s => s.id === currentStageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStageIcon = (stageId) => {
    const status = getStageStatus(stageId);
    switch (status) {
      case 'completed':
        return <CheckIcon color="success" fontSize="small" />;
      case 'active':
        return <PendingIcon color="primary" fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isGenerating}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Generating Packages</Typography>
          {!isGenerating && (
            <Button size="small" onClick={onClose} startIcon={<CloseIcon />}>
              Close
            </Button>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Current Stage */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Current Stage
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currentStageId 
              ? GENERATION_STAGES.find(s => s.id === currentStageId)?.label || 'Processing...'
              : 'Initializing...'}
          </Typography>
        </Box>

        {/* Status */}
        {status?.centres && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2">
              {status.centres.completed || 0} of {status.centres.total || 0} centres completed
            </Typography>
          </Box>
        )}

        {/* Stages List */}
        <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
          {GENERATION_STAGES.map((stage) => {
            const stageStatus = getStageStatus(stage.id);
            const isActive = stageStatus === 'active';
            const isCompleted = stageStatus === 'completed';

            return (
              <ListItem key={stage.id}>
                <ListItemIcon>
                  {isCompleted ? (
                    <CheckIcon color="success" fontSize="small" />
                  ) : isActive ? (
                    <PendingIcon color="primary" fontSize="small" />
                  ) : null}
                </ListItemIcon>
                <ListItemText
                  primary={stage.label}
                  primaryTypographyProps={{
                    sx: {
                      color: isCompleted ? 'success.main' : isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 500 : 400
                    }
                  }}
                />
                {isActive && (
                  <Chip
                    label="In Progress"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </ListItem>
            );
          })}
        </List>

        {/* Error */}
        {status?.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {status.error}
          </Alert>
        )}

        {/* Cancel Button */}
        {isGenerating && (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={onCancel}
            sx={{ mt: 2 }}
          >
            Cancel Generation
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerationProgressDialog;