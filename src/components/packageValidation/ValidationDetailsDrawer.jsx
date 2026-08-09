/* eslint-disable no-unused-vars */
/**
 * ValidationDetailsDrawer Component
 * Displays detailed validation information
 * 
 * Location: src/components/packageValidation/ValidationDetailsDrawer.jsx
 */

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Tooltip,
  Skeleton,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Inventory as PackageIcon, // ✅ Changed from Package to Inventory
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import ValidationStatusChip from './ValidationStatusChip';

const ValidationDetailsDrawer = ({
  open,
  onClose,
  validation,
  loading = false,
  onRunValidation,
  onExportReport
}) => {
  const [expandedSections, setExpandedSections] = useState({
    packageInfo: true,
    examInfo: false,
    validationResult: false,
    securityVerification: false,
    auditInfo: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 600 } }}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="70%" height={40} />
          <Skeleton variant="text" width="40%" height={30} />
          <Divider sx={{ my: 2 }} />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 1 }} />
          ))}
        </Box>
      </Drawer>
    );
  }

  if (!validation) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 600 } }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">Validation not found</Typography>
        </Box>
      </Drawer>
    );
  }

  const isPending = validation.status === 'PENDING';
  const isReady = validation.status === 'READY';
  const isFailed = validation.status === 'FAILED' || validation.status === 'REJECTED';

  const renderPackageInfo = () => (
    <Accordion
      expanded={expandedSections.packageInfo}
      onChange={() => toggleSection('packageInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <PackageIcon color="primary" />
          <Typography variant="subtitle1">Package Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Package Name</Typography>
            <Typography variant="body2" fontWeight={500}>
              {validation.packageName || validation.package?.name || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Version</Typography>
            <Typography variant="body2">V{validation.packageVersion || validation.version || 1}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Centre</Typography>
            <Typography variant="body2">
              {validation.centre?.name || validation.centreName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <ValidationStatusChip status={validation.status} size="small" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Generated Date</Typography>
            <Typography variant="body2">
              {new Date(validation.generatedAt || validation.createdAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderExamInfo = () => (
    <Accordion
      expanded={expandedSections.examInfo}
      onChange={() => toggleSection('examInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <SchoolIcon color="primary" />
          <Typography variant="subtitle1">Examination Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Examination</Typography>
            <Typography variant="body2">
              {validation.examination?.name || validation.examName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Instance</Typography>
            <Typography variant="body2">
              {validation.instance?.instanceCode || validation.instanceId || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Instance Version</Typography>
            <Typography variant="body2">
              V{validation.instanceVersion || 1}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Blueprint</Typography>
            <Typography variant="body2">
              {validation.blueprintName || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderValidationResult = () => (
    <Accordion
      expanded={expandedSections.validationResult}
      onChange={() => toggleSection('validationResult')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <AssessmentIcon color="primary" />
          <Typography variant="subtitle1">Validation Result</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">Validation Score</Typography>
              <Typography variant="h6">
                {validation.score !== undefined ? `${Math.round(validation.score)}%` : 'N/A'}
              </Typography>
            </Box>
            {validation.score !== undefined && (
              <LinearProgress
                variant="determinate"
                value={validation.score}
                color={validation.score >= 90 ? 'success' : validation.score >= 70 ? 'warning' : 'error'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <ValidationStatusChip status={validation.status} />
          </Grid>
          {validation.warnings && validation.warnings.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="subtitle2">Warnings</Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </Alert>
            </Grid>
          )}
          {validation.errors && validation.errors.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error" icon={<ErrorIcon />}>
                <Typography variant="subtitle2">Errors</Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderSecurityVerification = () => (
    <Accordion
      expanded={expandedSections.securityVerification}
      onChange={() => toggleSection('securityVerification')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <SecurityIcon color="primary" />
          <Typography variant="subtitle1">Security Verification</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Encryption</Typography>
            <Chip
              label={validation.encryptionVerified ? 'Verified' : 'Not Verified'}
              color={validation.encryptionVerified ? 'success' : 'error'}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Digital Signature</Typography>
            <Chip
              label={validation.signatureVerified ? 'Valid' : 'Invalid'}
              color={validation.signatureVerified ? 'success' : 'error'}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">SHA-256 Checksum</Typography>
            <Chip
              label={validation.checksumVerified ? 'Valid' : 'Invalid'}
              color={validation.checksumVerified ? 'success' : 'error'}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">CBTX Structure</Typography>
            <Chip
              label={validation.cbtxStructureValid ? 'Valid' : 'Invalid'}
              color={validation.cbtxStructureValid ? 'success' : 'error'}
              size="small"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderAuditInfo = () => (
    <Accordion
      expanded={expandedSections.auditInfo}
      onChange={() => toggleSection('auditInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <HistoryIcon color="primary" />
          <Typography variant="subtitle1">Audit Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Validated By</Typography>
            <Typography variant="body2">
              {validation.validatedBy?.name || validation.validatedBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Validated Date</Typography>
            <Typography variant="body2">
              {new Date(validation.validatedAt || validation.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Validation ID</Typography>
            <Typography variant="body2" fontWeight={500}>
              {validation._id}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 600, maxWidth: '90vw' } }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">
                Validation Report
              </Typography>
              <ValidationStatusChip status={validation.status} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {validation.packageName || validation.package?.name || 'Package'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {isPending && onRunValidation && (
          <Tooltip title="Run validation">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CheckIcon />}
              onClick={() => onRunValidation(validation.packageId || validation._id)}
            >
              Run Validation
            </Button>
          </Tooltip>
        )}
        {!isPending && onExportReport && (
          <Tooltip title="Export Report">
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => onExportReport(validation._id)}
            >
              Export Report
            </Button>
          </Tooltip>
        )}
        {isReady && (
          <Chip label="Ready for Distribution" color="success" size="small" />
        )}
        {isFailed && (
          <Chip label="Validation Failed" color="error" size="small" />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
        {renderPackageInfo()}
        {renderExamInfo()}
        {renderValidationResult()}
        {renderSecurityVerification()}
        {renderAuditInfo()}
      </Box>
    </Drawer>
  );
};

export default ValidationDetailsDrawer;