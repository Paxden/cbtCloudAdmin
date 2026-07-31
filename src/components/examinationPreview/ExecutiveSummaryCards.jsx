/* eslint-disable no-unused-vars */
/**
 * Executive Summary Cards Component
 * Displays key examination metrics
 */

import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton, Chip } from '@mui/material';
import {
  School as ExamIcon,
  People as CandidatesIcon,
  LocationOn as CentresIcon,
  QuestionAnswer as QuestionsIcon,
  Timer as DurationIcon,
  Grade as MarksIcon,
  Event as SessionsIcon,
  CheckCircle as StatusIcon,
} from '@mui/icons-material';

const SummaryCard = ({ title, value, icon: Icon, color, loading, subtitle, status }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {value || 0}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon />
          </Box>
        </Box>
        {status && (
          <Chip
            label={status}
            size="small"
            color={status === 'Ready' ? 'success' : status === 'Partial' ? 'warning' : 'error'}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

const ExecutiveSummaryCards = ({ preview, loading }) => {
  if (!preview && !loading) {
    return null;
  }

  const {
    examination = {},
    candidates = {},
    centres = {},
    blueprint = {},
    paper = {},
    policy = {},
    schedule = {},
    instructions = {},
  } = preview || {};

  const stats = {
    totalCandidates: candidates?.total || 0,
    assignedCandidates: candidates?.assignedToCentres || 0,
    totalCentres: centres?.total || 0,
    totalQuestions: blueprint?.totalQuestions || paper?.totalQuestions || 0,
    totalMarks: blueprint?.totalMarks || paper?.totalMarks || 0,
    duration: blueprint?.duration || 0,
    totalSessions: schedule?.totalSessions || 0,
    status: examination?.status || 'Draft',
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Examination"
          value={examination?.name || 'N/A'}
          icon={ExamIcon}
          color="primary"
          loading={loading}
          status={examination?.status}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Candidates"
          value={stats.totalCandidates}
          icon={CandidatesIcon}
          color="info"
          loading={loading}
          subtitle={`${stats.assignedCandidates} assigned`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Centres"
          value={stats.totalCentres}
          icon={CentresIcon}
          color="secondary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Questions"
          value={stats.totalQuestions}
          icon={QuestionsIcon}
          color="success"
          loading={loading}
          subtitle={`${stats.totalMarks} marks`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Duration"
          value={`${stats.duration} min`}
          icon={DurationIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Sessions"
          value={stats.totalSessions}
          icon={SessionsIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Passing Score"
          value={`${blueprint?.passingScore || 0}%`}
          icon={MarksIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Overall Status"
          value={stats.status}
          icon={StatusIcon}
          color={stats.status === 'Active' ? 'success' : 'warning'}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default ExecutiveSummaryCards;