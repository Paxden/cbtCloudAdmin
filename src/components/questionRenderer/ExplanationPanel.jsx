/**
 * Explanation Panel Component
 * Displays question explanation
 */

import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const ExplanationPanel = ({ question, showExplanation = false, defaultExpanded = false }) => {
  if (!question || !question.explanation) return null;

  if (!showExplanation) return null;

  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" fontWeight={600}>
          Explanation
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            '& p': { margin: '0 0 0.5em 0' },
            '& ul, & ol': { paddingLeft: '20px', margin: '4px 0' },
          }}
          dangerouslySetInnerHTML={{ __html: question.explanation }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ExplanationPanel;