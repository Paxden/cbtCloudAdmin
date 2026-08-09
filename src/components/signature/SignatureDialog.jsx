/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * SignatureDialog
 * Dialog for signing, verifying, revoking, and regenerating signatures
 * 
 * Location: src/components/signature/SignatureDialog.jsx
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
  Chip,
  Stack,
  Divider,
  LinearProgress,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  Verified as VerifiedIcon,
  GppGood as GppGoodIcon,
  GppBad as GppBadIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  SignatureStatus,
  SignatureStatusLabels,
} from '../../types/signature.types';

const SignatureDialog = ({
  open,
  onClose,
  packageId,
  packageCode,
  signatureStatus,
  onSign,
  onVerify,
  onRevoke,
  onRegenerate,
  loading = false,
  error = null,
  result = null,
  mode = 'sign', // sign, verify, revoke, regenerate
}) => {
  const [revokeReason, setRevokeReason] = useState('');

  useEffect(() => {
    if (open) {
      setRevokeReason('');
    }
  }, [open]);

  const getTitle = () => {
    switch (mode) {
      case 'sign': return 'Sign Package';
      case 'verify': return 'Verify Signature';
      case 'revoke': return 'Revoke Signature';
      case 'regenerate': return 'Regenerate Signature';
      default: return 'Signature Operation';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'sign': return <GppGoodIcon />;
      case 'verify': return <VerifiedIcon />;
      case 'revoke': return <CancelIcon />;
      case 'regenerate': return <ReplayIcon />;
      default: return <VerifiedIcon />;
    }
  };

  const getColor = () => {
    switch (mode) {
      case 'sign': return 'primary';
      case 'verify': return 'success';
      case 'revoke': return 'error';
      case 'regenerate': return 'warning';
      default: return 'primary';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'sign':
        return 'This will create a digital signature for the encrypted package using Ed25519.';
      case 'verify':
        return 'This will verify the digital signature against the package contents.';
      case 'revoke':
        return 'This will revoke the current signature. A reason is recommended.';
      case 'regenerate':
        return 'This will regenerate the signature with a new key pair.';
      default:
        return '';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ py: 4 }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            {mode === 'sign' ? 'Signing package...' : 
             mode === 'verify' ? 'Verifying signature...' : 
             mode === 'revoke' ? 'Revoking signature...' : 
             'Regenerating signature...'}
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" icon={<ErrorIcon />}>
          {error.message || 'Operation failed'}
        </Alert>
      );
    }

    if (result) {
      return (
        <Box>
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
            {mode === 'sign' ? 'Package signed successfully!' : 
             mode === 'verify' ? result.verified ? 'Signature verified successfully!' : 'Signature verification failed!' :
             mode === 'revoke' ? 'Signature revoked successfully!' : 
             'Signature regenerated successfully!'}
          </Alert>

          <Stack spacing={1}>
            {mode === 'sign' && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={SignatureStatusLabels[result.status] || result.status}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Algorithm
                  </Typography>
                  <Typography variant="body2">{result.algorithm || 'Ed25519'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Public Key ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {result.publicKeyIdentifier?.substring(0, 16) || 'N/A'}...
                  </Typography>
                </Box>
              </>
            )}

            {mode === 'verify' && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Verified
                  </Typography>
                  <Chip
                    label={result.verified ? 'Yes' : 'No'}
                    size="small"
                    color={result.verified ? 'success' : 'error'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Result
                  </Typography>
                  <Typography variant="body2">{result.result}</Typography>
                </Box>
                {result.details && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Details
                    </Typography>
                    <Typography variant="body2">{result.details}</Typography>
                  </Box>
                )}
              </>
            )}

            {mode === 'revoke' && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label="Revoked"
                    size="small"
                    color="error"
                  />
                </Box>
                {result.revocation?.reason && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Reason
                    </Typography>
                    <Typography variant="body2">{result.revocation.reason}</Typography>
                  </Box>
                )}
              </>
            )}

            {mode === 'regenerate' && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={SignatureStatusLabels[result.status] || result.status}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    New Public Key ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {result.publicKeyIdentifier?.substring(0, 16) || 'N/A'}...
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      );
    }

    // Form for revoke mode
    if (mode === 'revoke') {
      return (
        <Box>
          <Alert severity="warning" sx={{ mb: 3 }}>
            {getDescription()}
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Revocation Reason"
            placeholder="Please provide a reason for revoking this signature..."
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
          />
        </Box>
      );
    }

    // Confirmation for other modes
    return (
      <Box>
        <Alert severity={mode === 'verify' ? 'info' : 'warning'} sx={{ mb: 3 }}>
          {getDescription()}
        </Alert>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Package
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {packageCode || packageId}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Current Status
            </Typography>
            <Chip
              label={SignatureStatusLabels[signatureStatus?.status] || 'Not Signed'}
              size="small"
              color={signatureStatus?.status === SignatureStatus.VERIFIED ? 'success' : 'default'}
            />
          </Box>
        </Stack>

        {mode === 'regenerate' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This will revoke the current signature and create a new one with a fresh key pair.
          </Alert>
        )}
      </Box>
    );
  };

  const canSubmit = () => {
    if (mode === 'revoke') {
      return !loading && !result && revokeReason.length > 0;
    }
    return !loading && !result;
  };

  const getSubmitLabel = () => {
    if (loading) return 'Processing...';
    if (result) return 'Done';
    switch (mode) {
      case 'sign': return 'Sign Package';
      case 'verify': return 'Verify Signature';
      case 'revoke': return 'Revoke Signature';
      case 'regenerate': return 'Regenerate Signature';
      default: return 'Submit';
    }
  };

  const handleSubmit = () => {
    if (mode === 'sign') {
      onSign(packageId);
    } else if (mode === 'verify') {
      onVerify(packageId);
    } else if (mode === 'revoke') {
      onRevoke(packageId, revokeReason);
    } else if (mode === 'regenerate') {
      onRegenerate(packageId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getIcon()}
            <Typography variant="h6">{getTitle()}</Typography>
          </Box>
          <Button onClick={onClose} disabled={loading}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {renderContent()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <Button
            variant="contained"
            color={getColor()}
            onClick={handleSubmit}
            disabled={!canSubmit()}
            startIcon={getIcon()}
          >
            {getSubmitLabel()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SignatureDialog;