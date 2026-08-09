/* eslint-disable no-unused-vars */
/**
 * VersionComparisonDialog Component
 * Displays side-by-side comparison of two versions
 * 
 * Location: src/components/packageVersions/VersionComparisonDialog.jsx
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Close as CloseIcon,
  CompareArrows as CompareIcon,
  CheckCircle as MatchIcon,
  Error as DiffIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ComparisonRow = ({ label, valueA, valueB, format = (v) => v }) => {
  const isDifferent = valueA !== valueB;
  const isEqual = valueA === valueB;

  return (
    <TableRow>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">
            {format(valueA) || 'N/A'}
          </Typography>
          {isDifferent && (
            <Chip
              label="Changed"
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">
            {format(valueB) || 'N/A'}
          </Typography>
          {isDifferent && (
            <Chip
              label="Changed"
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
      </TableCell>
      <TableCell align="center">
        {isDifferent ? (
          <Chip
            icon={<DiffIcon />}
            label="Different"
            size="small"
            color="warning"
          />
        ) : (
          <Chip
            icon={<MatchIcon />}
            label="Same"
            size="small"
            color="success"
          />
        )}
      </TableCell>
    </TableRow>
  );
};

const VersionComparisonDialog = ({
  open,
  onClose,
  comparison,
  loading = false
}) => {
  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Comparing Versions</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 3 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (!comparison) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Version Comparison</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info">No comparison data available</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const {
    versionA,
    versionB,
    summary,
    differences,
    metadata
  } = comparison;

  const hasDifferences = differences && differences.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <CompareIcon color="primary" />
            <Typography variant="h6">
              Version Comparison
            </Typography>
            {summary && (
              <Chip
                label={hasDifferences ? 'Changes Detected' : 'No Changes'}
                color={hasDifferences ? 'warning' : 'success'}
                size="small"
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Version Headers */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={5}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Version A
              </Typography>
              <Typography variant="h6">
                {versionA?.name || `V${versionA?.versionNumber || 1}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {versionA?.generatedBy?.name || versionA?.generatedBy || 'System'} •{' '}
                {new Date(versionA?.generatedAt || versionA?.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <CompareIcon fontSize="large" color="primary" />
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Version B
              </Typography>
              <Typography variant="h6">
                {versionB?.name || `V${versionB?.versionNumber || 2}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {versionB?.generatedBy?.name || versionB?.generatedBy || 'System'} •{' '}
                {new Date(versionB?.generatedAt || versionB?.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Summary Stats */}
        {summary && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Differences
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {summary.totalDifferences || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Critical Changes
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {summary.criticalChanges || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Minor Changes
                  </Typography>
                  <Typography variant="h6" color="info.main">
                    {summary.minorChanges || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Comparison Table */}
        <Typography variant="subtitle2" gutterBottom>
          Detailed Comparison
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="20%">
                  <Typography variant="subtitle2">Attribute</Typography>
                </TableCell>
                <TableCell width="30%">
                  <Typography variant="subtitle2" color="primary">
                    Version A
                  </Typography>
                </TableCell>
                <TableCell width="30%">
                  <Typography variant="subtitle2" color="secondary">
                    Version B
                  </Typography>
                </TableCell>
                <TableCell width="20%" align="center">
                  <Typography variant="subtitle2">Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Basic Info */}
              <ComparisonRow
                label="Version Number"
                valueA={versionA?.versionNumber || versionA?.version}
                valueB={versionB?.versionNumber || versionB?.version}
              />
              <ComparisonRow
                label="Package Name"
                valueA={versionA?.packageName || versionA?.package?.name}
                valueB={versionB?.packageName || versionB?.package?.name}
              />
              <ComparisonRow
                label="Centre"
                valueA={versionA?.centreName || versionA?.centre?.name}
                valueB={versionB?.centreName || versionB?.centre?.name}
              />
              <ComparisonRow
                label="Examination"
                valueA={versionA?.examName || versionA?.examination?.name}
                valueB={versionB?.examName || versionB?.examination?.name}
              />
              <ComparisonRow
                label="Instance Version"
                valueA={versionA?.instanceVersion}
                valueB={versionB?.instanceVersion}
              />
              <ComparisonRow
                label="Status"
                valueA={versionA?.status}
                valueB={versionB?.status}
              />

              {/* Counts */}
              <ComparisonRow
                label="Candidate Count"
                valueA={versionA?.candidateCount}
                valueB={versionB?.candidateCount}
              />
              <ComparisonRow
                label="Question Count"
                valueA={versionA?.questionCount}
                valueB={versionB?.questionCount}
              />
              <ComparisonRow
                label="File Size"
                valueA={versionA?.fileSize ? `${(versionA.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                valueB={versionB?.fileSize ? `${(versionB.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
              />

              {/* Dates */}
              <ComparisonRow
                label="Generated Date"
                valueA={versionA?.generatedAt || versionA?.createdAt}
                valueB={versionB?.generatedAt || versionB?.createdAt}
                format={(v) => v ? new Date(v).toLocaleString() : 'N/A'}
              />

              {/* Custom Differences */}
              {differences && differences.map((diff, index) => (
                <TableRow key={index} sx={{ backgroundColor: 'warning.light' }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {diff.field}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {diff.valueA || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {diff.valueB || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={diff.severity === 'CRITICAL' ? <WarningIcon /> : <InfoIcon />}
                      label={diff.severity || 'Changed'}
                      size="small"
                      color={diff.severity === 'CRITICAL' ? 'error' : 'warning'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* No Differences Message */}
        {!hasDifferences && (
          <Alert severity="success" sx={{ mt: 2 }}>
            No differences found between these versions. They are identical.
          </Alert>
        )}

        {/* Metadata */}
        {metadata && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Comparison ID: {metadata.comparisonId || 'N/A'} • 
              Compared at: {metadata.comparedAt ? new Date(metadata.comparedAt).toLocaleString() : 'N/A'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VersionComparisonDialog;