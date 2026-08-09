/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * CandidatePaperGenerator
 * Dialog for generating candidate papers
 * 
 * Location: src/components/candidate-paper/CandidatePaperGenerator.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as GenerateIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  SelectionRule,
  QuestionOrder,
  OptionOrder,
  PaperStatusLabels,
  PaperStatusColors,
} from '../../types/candidatePaper.types';

const CandidatePaperGenerator = ({
  open,
  onClose,
  instanceId,
  centreId,
  candidateIds = [],
  onGenerate,
  loading = false,
  result = null,
  error = null,
}) => {
  const [selectionRule, setSelectionRule] = useState('RANDOM');
  const [questionOrder, setQuestionOrder] = useState('RANDOM');
  const [optionOrder, setOptionOrder] = useState('FIXED');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setSelectionRule('RANDOM');
      setQuestionOrder('RANDOM');
      setOptionOrder('FIXED');
      setNotes('');
    }
  }, [open]);

  const handleSubmit = () => {
    onGenerate({
      instanceId,
      centreId: centreId || undefined,
      candidateIds: candidateIds.length > 0 ? candidateIds : undefined,
      selectionRule,
      questionOrder,
      optionOrder,
      notes: notes || undefined,
    });
  };

  const getStatusChip = (status) => {
    const label = PaperStatusLabels[status] || status;
    const color = PaperStatusColors[status] || '#9e9e9e';
    
    return (
      <Chip
        label={label}
        size="small"
        sx={{ bgcolor: color, color: 'white' }}
      />
    );
  };

  const renderResult = () => {
    if (!result) return null;

    const hasErrors = result.failed > 0;
    const isComplete = result.successful > 0;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Generation Results
        </Typography>
        
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Total Candidates
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {result.total || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="success.main">
              Successful
            </Typography>
            <Typography variant="body2" fontWeight="medium" color="success.main">
              {result.successful || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="error.main">
              Failed
            </Typography>
            <Typography variant="body2" fontWeight="medium" color="error.main">
              {result.failed || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Skipped
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {result.skipped || 0}
            </Typography>
          </Box>
        </Stack>

        {result.papers && result.papers.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generated Papers
            </Typography>
            <Stack spacing={0.5}>
              {result.papers.slice(0, 5).map((paper) => (
                <Typography key={paper.id} variant="caption" display="block">
                  {paper.code} - {paper.candidateNumber}
                </Typography>
              ))}
              {result.papers.length > 5 && (
                <Typography variant="caption" color="text.secondary">
                  ... and {result.papers.length - 5} more
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {result.errors && result.errors.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="error" gutterBottom>
              Errors
            </Typography>
            <Stack spacing={0.5}>
              {result.errors.slice(0, 3).map((err, idx) => (
                <Typography key={idx} variant="caption" color="error" display="block">
                  {err.candidateNumber}: {err.error}
                </Typography>
              ))}
              {result.errors.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  ... and {result.errors.length - 3} more
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Generate Candidate Papers</Typography>
          <Button onClick={onClose} disabled={loading}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || 'Failed to generate papers'}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            This will generate individualized papers for {candidateIds.length > 0 ? 'selected candidates' : 'all candidates in the centre'}.
            Each paper will have unique question order and option order based on the selection rules.
          </Typography>
        </Alert>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Selection Rule</InputLabel>
          <Select
            value={selectionRule}
            onChange={(e) => setSelectionRule(e.target.value)}
            label="Selection Rule"
            disabled={loading}
          >
            <MenuItem value="RANDOM">Random - Questions randomly selected</MenuItem>
            <MenuItem value="FIXED">Fixed - All approved questions</MenuItem>
            <MenuItem value="MIXED">Mixed - 60% fixed, 40% random</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Question Order</InputLabel>
          <Select
            value={questionOrder}
            onChange={(e) => setQuestionOrder(e.target.value)}
            label="Question Order"
            disabled={loading}
          >
            <MenuItem value="RANDOM">Random - Shuffled questions</MenuItem>
            <MenuItem value="BLUEPRINT">Blueprint - Order by section</MenuItem>
            <MenuItem value="FIXED">Fixed - Original order</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Option Order</InputLabel>
          <Select
            value={optionOrder}
            onChange={(e) => setOptionOrder(e.target.value)}
            label="Option Order"
            disabled={loading}
          >
            <MenuItem value="RANDOM">Random - Shuffled options</MenuItem>
            <MenuItem value="FIXED">Fixed - Original order</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Notes (Optional)"
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this generation..."
          disabled={loading}
        />

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Generating papers...
            </Typography>
          </Box>
        )}

        {result && renderResult()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<GenerateIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Papers'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CandidatePaperGenerator;