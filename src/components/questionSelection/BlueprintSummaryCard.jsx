/**
 * Blueprint Summary Card Component
 * Displays blueprint summary for paper composition
 */

import { Paper, Typography, Grid, Chip, Stack,  Divider } from '@mui/material';
import { Architecture as BlueprintIcon } from '@mui/icons-material';

const BlueprintSummaryCard = ({ blueprint, loading }) => {
  if (loading || !blueprint) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="textSecondary">Loading blueprint...</Typography>
      </Paper>
    );
  }

  const { sections = [], totalQuestions = 0, totalMarks = 0, name, version } = blueprint;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <BlueprintIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          {name || 'Blueprint'}
        </Typography>
        <Chip label={`v${version || 1}`} size="small" variant="outlined" />
        <Chip label={`${sections.length} sections`} size="small" color="primary" variant="outlined" />
        <Chip label={`${totalQuestions} questions`} size="small" color="info" variant="outlined" />
        <Chip label={`${totalMarks} marks`} size="small" color="success" variant="outlined" />
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {sections.map((section, index) => {
          const questionCount = section.questionCount || 0;
          const marks = section.totalMarks || (questionCount * (section.marksPerQuestion || 0));

          return (
            <Grid item xs={12} sm={6} md={4} key={section.sectionId || index}>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  {section.name || `Section ${index + 1}`}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Subject: {section.subjectId?.name || 'N/A'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip label={`${questionCount} Q`} size="small" variant="outlined" />
                  <Chip label={`${marks} marks`} size="small" variant="outlined" color="success" />
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default BlueprintSummaryCard;