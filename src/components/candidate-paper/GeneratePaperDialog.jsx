/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * GeneratePaperDialog
 * Dialog for generating candidate papers
 * 
 * Location: src/components/candidate-paper/GeneratePaperDialog.jsx
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as GenerateIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import {
  SelectionRule,
  QuestionOrder,
  OptionOrder,
} from '../../types/candidatePaper.types';

const GeneratePaperDialog = ({
  open,
  onClose,
  instances = [],
  centres = [],
  candidates = [],
  onGenerate,
  onGenerateCentre,
  onGenerateAll,
  loading = false,
  error = null,
  result = null,
}) => {
  const [selectedInstance, setSelectedInstance] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [generationType, setGenerationType] = useState('single'); // single, centre, all
  const [selectionRule, setSelectionRule] = useState('RANDOM');
  const [questionOrder, setQuestionOrder] = useState('RANDOM');
  const [optionOrder, setOptionOrder] = useState('FIXED');
  const [notes, setNotes] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');

  // Filter candidates based on search
  const filteredCandidates = candidates.filter(c =>
    c.candidateNumber?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.name?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setSelectedInstance('');
      setSelectedCentre('');
      setSelectedCandidates([]);
      setGenerationType('single');
      setSelectionRule('RANDOM');
      setQuestionOrder('RANDOM');
      setOptionOrder('FIXED');
      setNotes('');
      setCandidateSearch('');
    }
  }, [open]);

  const handleCandidateToggle = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleGenerate = () => {
    if (generationType === 'single') {
      // Single candidate generation
      if (selectedCandidates.length === 1) {
        onGenerate({
          instanceId: selectedInstance,
          candidateId: selectedCandidates[0],
          selectionRule,
          questionOrder,
          optionOrder,
          notes: notes || undefined,
        });
      } else {
        // Generate for multiple selected candidates
        onGenerateCentre({
          instanceId: selectedInstance,
          centreId: selectedCentre,
          candidateIds: selectedCandidates,
          selectionRule,
          questionOrder,
          optionOrder,
          notes: notes || undefined,
        });
      }
    } else if (generationType === 'centre') {
      onGenerateCentre({
        instanceId: selectedInstance,
        centreId: selectedCentre,
        candidateIds: selectedCandidates.length > 0 ? selectedCandidates : undefined,
        selectionRule,
        questionOrder,
        optionOrder,
        notes: notes || undefined,
      });
    } else {
      onGenerateAll({
        instanceId: selectedInstance,
        centreIds: selectedCandidates.length > 0 ? selectedCandidates : undefined,
        selectionRule,
        questionOrder,
        optionOrder,
        notes: notes || undefined,
      });
    }
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

  const canSubmit = () => {
    if (!selectedInstance) return false;
    if (generationType === 'single' && selectedCandidates.length === 0) return false;
    if (generationType === 'centre' && !selectedCentre) return false;
    if (loading || result) return false;
    return true;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GenerateIcon />
            <Typography variant="h6">Generate Candidate Papers</Typography>
          </Box>
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

        {!result && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              This will generate individualized papers based on the selected examination instance
              and candidates. Each paper will have unique question and option ordering.
            </Alert>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Generation Type</InputLabel>
              <Select
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value)}
                label="Generation Type"
                disabled={loading}
              >
                <MenuItem value="single">Single/Selected Candidates</MenuItem>
                <MenuItem value="centre">All Candidates in Centre</MenuItem>
                <MenuItem value="all">All Candidates (All Centres)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Instance</InputLabel>
              <Select
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                label="Select Instance"
                disabled={loading}
              >
                {instances.length === 0 ? (
                  <MenuItem value="" disabled>
                    No locked instances available
                  </MenuItem>
                ) : (
                  instances.map((instance) => (
                    <MenuItem key={instance._id} value={instance._id}>
                      {instance.instanceCode} - {instance.examName}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {generationType === 'centre' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Centre</InputLabel>
                <Select
                  value={selectedCentre}
                  onChange={(e) => setSelectedCentre(e.target.value)}
                  label="Select Centre"
                  disabled={loading}
                >
                  {centres.length === 0 ? (
                    <MenuItem value="" disabled>
                      No centres available
                    </MenuItem>
                  ) : (
                    centres.map((centre) => (
                      <MenuItem key={centre._id} value={centre._id}>
                        {centre.code} - {centre.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}

            {(generationType === 'single' || generationType === 'centre') && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Select Candidates
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search candidates..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  size="small"
                  disabled={loading}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ maxHeight: 150, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                  {filteredCandidates.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No candidates found
                    </Typography>
                  ) : (
                    filteredCandidates.map((candidate) => (
                      <Box
                        key={candidate._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 0.5,
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate._id)}
                          onChange={() => handleCandidateToggle(candidate._id)}
                          disabled={loading}
                        />
                        <Typography variant="body2">
                          {candidate.candidateNumber} - {candidate.name || candidate.fullName}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Selected: {selectedCandidates.length} candidates
                </Typography>
              </Box>
            )}

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
          </Box>
        )}

        {result && renderResult()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <Button
            variant="contained"
            startIcon={<GenerateIcon />}
            onClick={handleGenerate}
            disabled={!canSubmit()}
          >
            {loading ? 'Generating...' : 'Generate Papers'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GeneratePaperDialog;