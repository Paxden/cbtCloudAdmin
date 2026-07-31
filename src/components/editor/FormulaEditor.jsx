/* eslint-disable no-unused-vars */
/**
 * Formula Editor Component
 * Insert mathematical formulas using KaTeX
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
} from '@mui/material';

const FormulaEditor = ({
  open,
  onClose,
  onInsert,
  initialFormula = '',
}) => {
  const [formula, setFormula] = useState(initialFormula);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState('');

  const handleInsert = () => {
    if (!formula.trim()) {
      setError('Formula cannot be empty');
      return;
    }

    // Basic formula validation
    try {
      // For now, just check if it's not empty
      onInsert(formula);
      handleClose();
    } catch (err) {
      setError('Invalid formula syntax');
    }
  };

  const handleClose = () => {
    setFormula('');
    setError(null);
    setPreview('');
    onClose();
  };

  const handleFormulaChange = (value) => {
    setFormula(value);
    setError(null);
    setPreview(value);
  };

  // Common formulas for quick insertion
  const commonFormulas = [
    { label: 'x² + y² = z²', value: 'x^2 + y^2 = z^2' },
    { label: 'E = mc²', value: 'E = mc^2' },
    { label: '√x', value: '\\sqrt{x}' },
    { label: 'π', value: '\\pi' },
    { label: '∑', value: '\\sum' },
    { label: '∫', value: '\\int' },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>Insert Mathematical Formula</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="LaTeX Formula"
            value={formula}
            onChange={(e) => handleFormulaChange(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder='e.g., x^2 + y^2 = z^2'
            helperText="Enter your formula in LaTeX format"
          />

          <Box>
            <Typography variant="caption" color="textSecondary" gutterBottom display="block">
              Quick Templates:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonFormulas.map((item) => (
                <Button
                  key={item.value}
                  size="small"
                  variant="outlined"
                  onClick={() => handleFormulaChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {preview && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                textAlign: 'center',
                minHeight: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" sx={{ fontSize: '1.25rem' }}>
                {preview}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleInsert} variant="contained" disabled={!formula.trim()}>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormulaEditor;