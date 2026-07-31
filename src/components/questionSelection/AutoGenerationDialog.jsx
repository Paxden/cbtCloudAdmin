/**
 * Auto Generation Dialog Component
 * Dialog for automatic paper generation
 */

import  { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Chip,
  Alert,
  Box,
} from '@mui/material';
import { AutoAwesome as GenerateIcon } from '@mui/icons-material';

const REUSE_POLICIES = [
  { value: 'NEVER', label: 'Never Reuse Questions' },
  { value: 'AFTER_EXAMINATION', label: 'Reuse After Examination' },
  { value: 'AFTER_MONTHS', label: 'Reuse After Months' },
  { value: 'AFTER_YEAR', label: 'Reuse After Year' },
  { value: 'EXCLUDE_RECENT', label: 'Exclude Recent Questions' },
];

const AutoGenerationDialog = ({ open, onClose, onGenerate, blueprint, loading }) => {
  const [randomSeed, setRandomSeed] = useState('');
  const [reusePolicy, setReusePolicy] = useState('NEVER');
  const [reuseValue, setReuseValue] = useState(6);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  const handleGenerate = () => {
    onGenerate({
      randomSeed: randomSeed || `seed_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      reusePolicy: {
        type: reusePolicy,
        value: reusePolicy === 'AFTER_MONTHS' ? reuseValue : undefined,
      },
      options: {
        shuffleQuestions,
        shuffleOptions,
        includeSnapshots: true,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <GenerateIcon color="primary" />
          <Typography variant="h6">Auto Generate Paper</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {!blueprint && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No active blueprint found. Please create a blueprint first.
          </Alert>
        )}

        {blueprint && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Generating paper based on blueprint: {blueprint.name}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Random Seed (Optional)"
            placeholder="Leave blank for auto-generated seed"
            value={randomSeed}
            onChange={(e) => setRandomSeed(e.target.value)}
            fullWidth
            size="small"
            helperText="Same seed produces the same paper for reproducibility"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Reuse Policy</InputLabel>
            <Select
              value={reusePolicy}
              onChange={(e) => setReusePolicy(e.target.value)}
              label="Reuse Policy"
            >
              {REUSE_POLICIES.map((policy) => (
                <MenuItem key={policy.value} value={policy.value}>
                  {policy.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {reusePolicy === 'AFTER_MONTHS' && (
            <TextField
              label="Months"
              type="number"
              value={reuseValue}
              onChange={(e) => setReuseValue(parseInt(e.target.value) || 6)}
              fullWidth
              size="small"
              helperText="Questions older than this many months can be reused"
              InputProps={{ inputProps: { min: 1, max: 60 } }}
            />
          )}

          <Box>
            <Typography variant="subtitle2" fontWeight={500} gutterBottom>
              Options
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip
                label="Shuffle Questions"
                color={shuffleQuestions ? 'primary' : 'default'}
                onClick={() => setShuffleQuestions(!shuffleQuestions)}
                variant={shuffleQuestions ? 'filled' : 'outlined'}
                clickable
              />
              <Chip
                label="Shuffle Options"
                color={shuffleOptions ? 'primary' : 'default'}
                onClick={() => setShuffleOptions(!shuffleOptions)}
                variant={shuffleOptions ? 'filled' : 'outlined'}
                clickable
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          startIcon={<GenerateIcon />}
          disabled={loading || !blueprint}
        >
          {loading ? 'Generating...' : 'Generate Paper'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutoGenerationDialog;