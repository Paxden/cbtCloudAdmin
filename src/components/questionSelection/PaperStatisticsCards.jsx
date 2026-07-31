/* eslint-disable no-unused-vars */
/**
 * Paper Statistics Cards Component
 * Displays paper composition statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  QuestionAnswer as QuestionsIcon,
  CheckCircle as SelectedIcon,
  Lock as LockedIcon,
  LockOpen as UnlockedIcon,
  Assessment as ScoreIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, color, loading, subtitle }) => {
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
            <Typography variant="h4" fontWeight={600}>
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
      </CardContent>
    </Card>
  );
};

const PaperStatisticsCards = ({ stats, loading }) => {
  if (!stats && !loading) {
    return null;
  }

  const {
    totalQuestions = 0,
    selectedQuestions = 0,
    lockedQuestions = 0,
    unlockedQuestions = 0,
    validationScore = 0,
  } = stats || {};

  const remainingQuestions = totalQuestions - selectedQuestions;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Questions"
          value={totalQuestions}
          icon={QuestionsIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Selected"
          value={selectedQuestions}
          icon={SelectedIcon}
          color="success"
          loading={loading}
          subtitle={`${totalQuestions > 0 ? Math.round((selectedQuestions / totalQuestions) * 100) : 0}%`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Remaining"
          value={remainingQuestions}
          icon={QuestionsIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Locked"
          value={lockedQuestions}
          icon={LockedIcon}
          color="info"
          loading={loading}
          subtitle={`${unlockedQuestions} unlocked`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Validation Score"
          value={`${validationScore}%`}
          icon={ScoreIcon}
          color={validationScore >= 80 ? 'success' : validationScore >= 50 ? 'warning' : 'error'}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default PaperStatisticsCards;