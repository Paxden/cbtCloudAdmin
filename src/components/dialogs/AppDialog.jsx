/**
 * App Dialog Component
 * Reusable dialog with loading states
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AppDialog = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen = false,
  loading = false,
  disableClose = false,
  showCloseButton = true,
  dividers = true,
  sx = {},
  contentSx = {},
}) => {
  const handleClose = () => {
    if (!disableClose && !loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 3,
          ...sx,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {showCloseButton && (
          <IconButton
            onClick={handleClose}
            disabled={disableClose || loading}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {dividers && <Divider />}

      {/* Content */}
      <DialogContent
        sx={{
          py: 3,
          px: 3,
          ...contentSx,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </DialogContent>

      {dividers && <Divider />}

      {/* Footer */}
      {actions && (
        <DialogActions
          sx={{
            py: 2,
            px: 3,
            gap: 1,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AppDialog;