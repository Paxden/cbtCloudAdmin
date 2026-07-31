/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Table Controls Component
 * Insert and manage tables in the editor
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Stack,
} from '@mui/material';

const TableControls = ({
  open,
  onClose,
  onInsert,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  // ✅ Reset values when dialog opens
  useEffect(() => {
    if (open) {
      setRows(3);
      setCols(3);
    }
  }, [open]);

  const handleInsert = () => {
    const rowCount = Math.max(1, parseInt(rows) || 1);
    const colCount = Math.max(1, parseInt(cols) || 1);
    
    onInsert({ 
      rows: rowCount, 
      cols: colCount 
    });
  };

  const handleClose = () => {
    setRows(3);
    setCols(3);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>Insert Table</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
              InputProps={{
                inputProps: { min: 1, max: 10 },
              }}
              fullWidth
            />

            <TextField
              label="Columns"
              type="number"
              value={cols}
              onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
              InputProps={{
                inputProps: { min: 1, max: 10 },
              }}
              fullWidth
            />
          </Stack>

          {/* Table Preview */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(parseInt(cols) || 3, 5)}, 30px)`,
                gap: 2,
                justifyContent: 'center',
              }}
            >
              {Array.from({ length: Math.min(parseInt(rows) || 3, 5) * Math.min(parseInt(cols) || 3, 5) }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 30,
                    height: 20,
                    bgcolor: 'primary.main',
                    borderRadius: 0.5,
                    opacity: 0.6,
                  }}
                />
              ))}
            </Box>
            <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
              Preview: {Math.min(parseInt(rows) || 3, 5)} × {Math.min(parseInt(cols) || 3, 5)}
              {(parseInt(rows) || 3) > 5 && ` (${parseInt(rows) || 3} rows total)`}
              {(parseInt(cols) || 3) > 5 && ` (${parseInt(cols) || 3} columns total)`}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleInsert} variant="contained">
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableControls;