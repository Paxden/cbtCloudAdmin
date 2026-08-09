/* eslint-disable no-unused-vars */
/**
 * GenerationSummaryCard Component
 * Displays generation summary
 * 
 * Location: src/components/packages/GenerationSummaryCard.jsx
 */

import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Skeleton,
  LinearProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Timer as TimerIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';

const SummaryItem = ({ icon, label, value, color = 'primary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
    <Box sx={{ color: theme => theme.palette[color].main }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

const GenerationSummaryCard = ({
  summary,
  instance,
  centres,
  loading = false
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={32} />
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" height={28} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  if (!summary && !instance) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select an instance and centres to view generation summary
        </Typography>
      </Paper>
    );
  }

  const candidateCount = summary?.candidateCount || instance?.candidateCount || 0;
  const centreCount = centres?.length || 0;
  const questionCount = summary?.questionCount || instance?.approvedQuestionCount || 0;
  const duration = summary?.duration || instance?.configuration?.duration || 0;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Generation Summary
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {/* Instance Info */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<SchoolIcon />}
            label="Instance"
            value={instance?.instanceCode}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<DescriptionIcon />}
            label="Examination"
            value={instance?.examName}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<PeopleIcon />}
            label="Candidates"
            value={candidateCount}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<LocationIcon />}
            label="Centres Selected"
            value={centreCount}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<DescriptionIcon />}
            label="Questions"
            value={questionCount}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<TimerIcon />}
            label="Duration"
            value={`${duration} min`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<SecurityIcon />}
            label="Encryption"
            value={summary?.encryptionEnabled !== false ? 'Enabled' : 'Disabled'}
            color={summary?.encryptionEnabled !== false ? 'success' : 'default'}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<LockIcon />}
            label="Digital Signature"
            value={summary?.signatureEnabled !== false ? 'Enabled' : 'Disabled'}
            color={summary?.signatureEnabled !== false ? 'success' : 'default'}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<QrCodeIcon />}
            label="Checksum"
            value={summary?.checksumEnabled !== false ? 'Enabled' : 'Disabled'}
            color={summary?.checksumEnabled !== false ? 'success' : 'default'}
          />
        </Grid>
      </Grid>

      {/* Question Distribution */}
      {summary?.questionDistribution && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Question Distribution
          </Typography>
          <Grid container spacing={1}>
            {Object.entries(summary.questionDistribution).map(([type, count]) => (
              <Grid item xs={6} sm={3} key={type}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption">{type}</Typography>
                  <Typography variant="caption" fontWeight={500}>{count}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Difficulty Distribution */}
      {summary?.difficultyDistribution && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Difficulty Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {Object.entries(summary.difficultyDistribution).map(([level, count]) => (
              <Box key={level} sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">{level}</Typography>
                  <Typography variant="caption" fontWeight={500}>{count}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(count / Object.values(summary.difficultyDistribution).reduce((a, b) => a + b, 0)) * 100}
                  sx={{ height: 6, borderRadius: 3 }}
                  color={level === 'EASY' ? 'success' : level === 'MEDIUM' ? 'warning' : 'error'}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default GenerationSummaryCard;