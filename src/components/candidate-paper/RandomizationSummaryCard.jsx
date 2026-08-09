/* eslint-disable no-unused-vars */
/**
 * RandomizationSummaryCard
 * Displays randomization summary for a candidate paper
 * 
 * Location: src/components/candidate-paper/RandomizationSummaryCard.jsx
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Grid,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Shuffle as ShuffleIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const RandomizationSummaryCard = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Randomization Summary
          </Typography>
          <LinearProgress />
          <Typography sx={{ mt: 1 }}>Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Randomization Summary
          </Typography>
          <Typography color="text.secondary">
            No randomization data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const selectionRule = data.questionSelectionRule || {};
  const questionOrder = data.questionOrder || {};
  const optionOrder = data.optionOrder || {};

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <ShuffleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Randomization Summary
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Question Selection
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Rule
                  </Typography>
                  <Chip
                    label={selectionRule.type || 'N/A'}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Seed
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {selectionRule.seed?.substring(0, 12) || 'N/A'}...
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Version
                  </Typography>
                  <Typography variant="body2">{selectionRule.version || '1.0'}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Question Order
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Chip
                    label={questionOrder.type || 'N/A'}
                    size="small"
                    color="secondary"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Algorithm
                  </Typography>
                  <Typography variant="body2">{questionOrder.algorithm || 'FISHER_YATES'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Seed
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {questionOrder.seed?.substring(0, 12) || 'N/A'}...
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Option Order
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Chip
                    label={optionOrder.type || 'FIXED'}
                    size="small"
                    color={optionOrder.type === 'RANDOM' ? 'warning' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Algorithm
                  </Typography>
                  <Typography variant="body2">{optionOrder.algorithm || 'FISHER_YATES'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Seed
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {optionOrder.seed?.substring(0, 12) || 'N/A'}...
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Statistics */}
        {data.generationStats && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Generation Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Considered
                  </Typography>
                  <Typography variant="h6">{data.generationStats.questionsConsidered || 0}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Selected
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {data.generationStats.questionsSelected || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Rejected
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {data.generationStats.questionsRejected || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Iterations
                  </Typography>
                  <Typography variant="h6">{data.generationStats.selectionIterations || 0}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RandomizationSummaryCard;