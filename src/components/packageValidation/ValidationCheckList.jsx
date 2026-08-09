/**
 * ValidationChecklist Component
 * Displays validation checklist with status indicators
 * 
 * Location: src/components/packageValidation/ValidationChecklist.jsx
 */

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Divider,
  Skeleton,
  Alert
} from '@mui/material';
import {
  CheckCircle as PassIcon,
  Error as FailIcon,
  Warning as WarningIcon,
  Help as UnknownIcon
} from '@mui/icons-material';

const CHECKLIST_ITEMS = [
  { id: 'instance_exists', label: 'Examination Instance Exists' },
  { id: 'candidates_included', label: 'Candidates Included' },
  { id: 'candidate_count_matches', label: 'Candidate Count Matches' },
  { id: 'questions_included', label: 'Questions Included' },
  { id: 'blueprint_matches', label: 'Blueprint Distribution Matches' },
  { id: 'configuration_included', label: 'Configuration Included' },
  { id: 'instructions_included', label: 'Instructions Included' },
  { id: 'encryption_completed', label: 'Encryption Completed' },
  { id: 'signature_valid', label: 'Digital Signature Valid' },
  { id: 'checksum_valid', label: 'SHA-256 Checksum Valid' },
  { id: 'manifest_valid', label: 'Manifest Valid' },
  { id: 'cbtx_structure_valid', label: 'CBTX Structure Valid' }
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'PASSED':
      return <PassIcon color="success" />;
    case 'FAILED':
      return <FailIcon color="error" />;
    case 'WARNING':
      return <WarningIcon color="warning" />;
    default:
      return <UnknownIcon color="disabled" />;
  }
};

const getStatusChip = (status) => {
  switch (status) {
    case 'PASSED':
      return <Chip label="Passed" color="success" size="small" />;
    case 'FAILED':
      return <Chip label="Failed" color="error" size="small" />;
    case 'WARNING':
      return <Chip label="Warning" color="warning" size="small" />;
    default:
      return <Chip label="Pending" color="default" size="small" />;
  }
};

const ValidationChecklist = ({ checklist, loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Validation Checklist
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {[...Array(6)].map((_, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" width={80} height={24} />
          </Box>
        ))}
      </Paper>
    );
  }

  if (!checklist) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No checklist data available
        </Typography>
      </Paper>
    );
  }

  const items = checklist.items || checklist;
  const summary = checklist.summary || {};

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Validation Checklist
        </Typography>
        <Box display="flex" gap={1}>
          <Chip
            label={`${summary.passed || 0} Passed`}
            color="success"
            size="small"
          />
          <Chip
            label={`${summary.failed || 0} Failed`}
            color="error"
            size="small"
          />
          <Chip
            label={`${summary.warnings || 0} Warnings`}
            color="warning"
            size="small"
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List dense>
        {CHECKLIST_ITEMS.map((item) => {
          const status = items[item.id] || 'PENDING';
          const details = items[`${item.id}_details`] || '';

          return (
            <ListItem key={item.id} divider>
              <ListItemIcon>
                {getStatusIcon(status)}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={details}
                secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
              {getStatusChip(status)}
            </ListItem>
          );
        })}
      </List>

      {/* Summary Alert */}
      {summary.failed > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {summary.failed} check(s) failed. Please review and fix issues.
        </Alert>
      )}
      {summary.warnings > 0 && summary.failed === 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {summary.warnings} warning(s) found. Review recommended.
        </Alert>
      )}
      {summary.passed === CHECKLIST_ITEMS.length && (
        <Alert severity="success" sx={{ mt: 2 }}>
          All checks passed! Package is ready for distribution.
        </Alert>
      )}
    </Paper>
  );
};

export default ValidationChecklist;