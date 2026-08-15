/**
 * Question Metadata Panel Component
 * Displays question metadata
 */

import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Stack } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const MetadataRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body2">{value || '-'}</Typography>
  </Box>
);

const QuestionMetadataPanel = ({ question, showMetadata = false, defaultExpanded = false }) => {
  if (!question || !showMetadata) return null;

  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" fontWeight={600}>
          Metadata
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={0.5}>
          <MetadataRow label="Category" value={question.categoryId?.name || 'N/A'} />
          <MetadataRow label="Subject" value={question.subjectId?.name || 'N/A'} />
          <MetadataRow label="Topic" value={question.topicId?.name || 'N/A'} />
          <MetadataRow label="Difficulty" value={question.difficultyId?.name || 'N/A'} />
          <MetadataRow label="Question Type" value={question.questionTypeId?.name || 'N/A'} />
          <MetadataRow label="Marks" value={question.marks || 0} />
          <MetadataRow label="Status" value={question.status || 'N/A'} />
          <MetadataRow label="Version" value={question.currentVersion || 1} />
          <MetadataRow label="Author" value={question.createdBy?.name || 'N/A'} />
          <MetadataRow
            label="Created"
            value={question.createdAt ? new Date(question.createdAt).toLocaleString() : 'N/A'}
          />
          <MetadataRow
            label="Last Updated"
            value={question.updatedAt ? new Date(question.updatedAt).toLocaleString() : 'N/A'}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestionMetadataPanel;