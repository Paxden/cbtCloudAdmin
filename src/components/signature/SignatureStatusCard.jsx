/* eslint-disable no-unused-vars */
/**
 * SignatureStatusCard
 * Displays digital signature status for a package
 * 
 * Location: src/components/signature/SignatureStatusCard.jsx
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  GppGood as GppGoodIcon,
  GppBad as GppBadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';
import {
  SignatureStatus,
  SignatureStatusLabels,
  SignatureStatusColors,
} from '../../types/signature.types';

const SignatureStatusCard = ({
  signature,
  loading = false,
  onRefresh,
  onSign,
  onVerify,
  onRevoke,
  onRegenerate,
  canSign = true,
  canVerify = true,
  canRevoke = true,
  canRegenerate = true,
}) => {
  const getStatusChip = (status) => {
    const label = SignatureStatusLabels[status] || status;
    const color = SignatureStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === SignatureStatus.VERIFIED) {
      icon = <VerifiedIcon />;
    } else if (status === SignatureStatus.SIGNED) {
      icon = <GppGoodIcon />;
    } else if (status === SignatureStatus.FAILED) {
      icon = <GppBadIcon />;
    } else if (status === SignatureStatus.REVOKED) {
      icon = <CancelIcon />;
    } else if (status === SignatureStatus.SIGNING) {
      icon = <PendingIcon />;
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        sx={{
          bgcolor: color,
          color: 'white',
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    );
  };

  // ✅ Helper to safely get display name from user object
  const getUserDisplayName = (user) => {
    if (!user) return 'Unknown';
    if (typeof user === 'string') return user;
    if (user.name) return user.name;
    if (user.email) return user.email;
    return 'Unknown';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <VerifiedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Digital Signature
          </Typography>
          <LinearProgress />
          <Typography sx={{ mt: 1 }}>Loading signature status...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!signature) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <VerifiedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Digital Signature
          </Typography>
          <Typography color="text.secondary">
            No signature data available
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sign the package to generate a digital signature
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isSigned = signature.status === SignatureStatus.SIGNED || 
                   signature.status === SignatureStatus.VERIFIED;
  const isVerified = signature.status === SignatureStatus.VERIFIED;
  const isRevoked = signature.revoked || signature.status === SignatureStatus.REVOKED;
  const isPending = signature.status === SignatureStatus.PENDING || 
                    signature.status === SignatureStatus.SIGNING;

  // ✅ Safely get signed by display name
  const signedByDisplay = getUserDisplayName(signature.signedBy);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <VerifiedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Digital Signature
          </Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          {getStatusChip(signature.status)}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Algorithm
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {signature.algorithm || 'Ed25519'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Version
            </Typography>
            <Typography variant="body2">
              {signature.signatureVersion || '1.0.0'}
            </Typography>
          </Box>

          {signature.publicKeyIdentifier && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Public Key ID
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {signature.publicKeyIdentifier.substring(0, 16)}...
              </Typography>
            </Box>
          )}

          {signature.signedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Signed At
              </Typography>
              <Typography variant="body2">
                {new Date(signature.signedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {signature.signedBy && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Signed By
              </Typography>
              <Typography variant="body2">
                {signedByDisplay}
              </Typography>
            </Box>
          )}

          {signature.verifiedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Verified At
              </Typography>
              <Typography variant="body2">
                {new Date(signature.verifiedAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {signature.metadata?.signatureSize && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Signature Size
              </Typography>
              <Typography variant="body2">
                {signature.metadata.signatureSize} bytes
              </Typography>
            </Box>
          )}

          {isRevoked && signature.revocation?.reason && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Revocation Reason
              </Typography>
              <Typography variant="body2" color="error">
                {signature.revocation.reason}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Actions */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isSigned && !isPending && canSign && (
            <Chip
              label="Sign Package"
              color="primary"
              onClick={onSign}
              icon={<GppGoodIcon />}
              clickable
            />
          )}

          {isSigned && !isVerified && !isRevoked && canVerify && (
            <Chip
              label="Verify Signature"
              color="success"
              onClick={onVerify}
              icon={<VerifiedIcon />}
              clickable
            />
          )}

          {isSigned && !isRevoked && canRegenerate && (
            <Chip
              label="Regenerate"
              color="warning"
              onClick={onRegenerate}
              icon={<ReplayIcon />}
              clickable
            />
          )}

          {isSigned && !isRevoked && canRevoke && (
            <Chip
              label="Revoke"
              color="error"
              onClick={onRevoke}
              icon={<CancelIcon />}
              clickable
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SignatureStatusCard;