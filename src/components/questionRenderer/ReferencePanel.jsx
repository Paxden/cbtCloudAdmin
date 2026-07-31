/**
 * Reference Panel Component
 * Displays question reference
 */

import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Stack } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const ReferencePanel = ({ question, showReference = false, defaultExpanded = false }) => {
  if (!question) return null;

  const hasReference = question.reference || question.referenceBook || question.referenceSection || question.referenceUrl;

  if (!hasReference || !showReference) return null;

  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" fontWeight={600}>
          Reference
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          {question.referenceBook && (
            <Box>
              <Typography variant="caption" color="textSecondary">Book / Document</Typography>
              <Typography variant="body2">{question.referenceBook}</Typography>
            </Box>
          )}
          {question.referenceSection && (
            <Box>
              <Typography variant="caption" color="textSecondary">Section</Typography>
              <Typography variant="body2">{question.referenceSection}</Typography>
            </Box>
          )}
          {question.referenceUrl && (
            <Box>
              <Typography variant="caption" color="textSecondary">URL</Typography>
              <Typography
                variant="body2"
                component="a"
                href={question.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                {question.referenceUrl}
              </Typography>
            </Box>
          )}
          {question.reference && !question.referenceBook && !question.referenceSection && !question.referenceUrl && (
            <Typography variant="body2">{question.reference}</Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default ReferencePanel;