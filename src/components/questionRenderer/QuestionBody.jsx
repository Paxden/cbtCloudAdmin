/* eslint-disable no-unused-vars */
/**
 * Question Body Component
 * Renders the main question content with rich text
 */

import { Box, Typography, Paper } from '@mui/material';

const QuestionBody = ({ question, showImages = true }) => {
  if (!question || !question.questionText) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        minHeight: 60,
      }}
    >
      <Box
        className="question-body"
        sx={{
          '& p': {
            margin: '0 0 1em 0',
            lineHeight: 1.8,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
            margin: '8px 0',
          },
          '& table': {
            borderCollapse: 'collapse',
            margin: '8px 0',
            width: '100%',
            '& td, & th': {
              border: '1px solid',
              borderColor: 'divider',
              padding: '8px',
            },
            '& th': {
              backgroundColor: 'action.hover',
              fontWeight: 600,
            },
          },
          '& ul, & ol': {
            paddingLeft: '24px',
            margin: '8px 0',
          },
          '& li': {
            marginBottom: '4px',
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            paddingLeft: '16px',
            margin: '8px 0',
            color: 'text.secondary',
          },
          '& code': {
            backgroundColor: 'action.hover',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: '0.875em',
            fontFamily: 'monospace',
          },
          '& pre': {
            backgroundColor: 'action.hover',
            padding: '16px',
            borderRadius: 8,
            overflowX: 'auto',
            '& code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
          '& sup': {
            fontSize: '0.75em',
            verticalAlign: 'super',
          },
          '& sub': {
            fontSize: '0.75em',
            verticalAlign: 'sub',
          },
          '& .math': {
            fontSize: '1.1em',
            padding: '0 4px',
          },
        }}
        dangerouslySetInnerHTML={{ __html: question.questionText }}
      />
    </Paper>
  );
};

export default QuestionBody;