/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Link Dialog Component
 * Insert and edit links in the editor
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';

const LinkDialog = ({
  open,
  onClose,
  onInsert,
  initialUrl = '',
  initialText = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
      setText(initialText);
      setError(null);
    }
  }, [open, initialUrl, initialText]);

  const handleInsert = () => {
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    // Simple URL validation
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        setError('URL must start with http:// or https://');
        return;
      }
    } catch {
      // If URL doesn't have protocol, add https://
      const validUrl = url.startsWith('http') ? url : `https://${url}`;
      try {
        new URL(validUrl);
        setUrl(validUrl);
      } catch {
        setError('Invalid URL format');
        return;
      }
    }

    onInsert({ url, text: text || url });
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setText('');
    setError(null);
    onClose();
  };

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
      <DialogTitle>Insert Link</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            placeholder="https://example.com"
            required
          />

          <TextField
            label="Link Text (optional)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            placeholder="Display text"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleInsert} variant="contained" disabled={!url.trim()}>
          Insert Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ✅ Make sure this is a default export
export default LinkDialog;