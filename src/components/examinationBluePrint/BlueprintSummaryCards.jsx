/**
 * Blueprint Summary Cards Component
 * Displays blueprint statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  LibraryBooks as SectionsIcon,
  QuestionAnswer as QuestionsIcon,
  Grade as MarksIcon,
  Subject as SubjectsIcon,
  Topic as TopicsIcon,
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

const BlueprintSummaryCards = ({ blueprint, loading }) => {
  if (!blueprint && !loading) {
    return null;
  }

  const {
    sections = [],
    totalQuestions = 0,
    totalMarks = 0,
  } = blueprint || {};

  // Calculate unique subjects and topics
  const subjects = new Set();
  const topics = new Set();
  const difficultyLevels = new Set();

  sections.forEach(section => {
    if (section.subjectId) {
      subjects.add(section.subjectId._id || section.subjectId);
    }
    if (section.topicId) {
      topics.add(section.topicId._id || section.topicId);
    }
    if (section.difficultyDistribution) {
      section.difficultyDistribution.forEach(d => difficultyLevels.add(d.difficulty));
    }
  });

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Sections"
          value={sections.length}
          icon={SectionsIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Questions"
          value={totalQuestions}
          icon={QuestionsIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Marks"
          value={totalMarks}
          icon={MarksIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Subjects"
          value={subjects.size}
          icon={SubjectsIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Topics"
          value={topics.size}
          icon={TopicsIcon}
          color="secondary"
          loading={loading}
          subtitle={`${difficultyLevels.size} difficulty levels`}
        />
      </Grid>
    </Grid>
  );
};

export default BlueprintSummaryCards;