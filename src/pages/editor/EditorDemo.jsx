/**
 * Editor Demo Page
 * Test and preview the question editor
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import QuestionEditor from '../../components/editor/QuestionEditor';
import AppPageHeader from '../../components/common/AppPageHeader';
import { validateEditorContent, getContentStats } from '../../utils/editor/editorValidator';
import { sanitizeHtml } from '../../utils/editor/editorExtensions';

const EditorDemo = () => {
  const [content, setContent] = useState({ html: '', json: null });
  const [tab, setTab] = useState(0);
  const [validationResult, setValidationResult] = useState(null);
  const [stats, setStats] = useState(null);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setValidationResult(null);
  };

  const handleValidate = () => {
    const result = validateEditorContent(content.json, content.html, {
      requireContent: true,
    });
    setValidationResult(result);

    const stats = getContentStats(content.html);
    setStats(stats);
  };

  const handleClear = () => {
    setContent({ html: '', json: null });
    setValidationResult(null);
    setStats(null);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Editor Demo"
        subtitle="Test the question content editor"
      />

      <Grid container spacing={3}>
        {/* Editor */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <QuestionEditor
                value={content.html}
                onChange={handleContentChange}
                placeholder="Start writing your question content here..."
                maxLength={10000}
              />
            </CardContent>
          </Card>

          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleValidate}
              >
                Validate Content
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                color="warning"
              >
                Clear Content
              </Button>
            </Stack>
          </Box>

          {validationResult && (
            <Box sx={{ mt: 2 }}>
              {validationResult.isValid ? (
                <Alert severity="success">
                  Content is valid!
                  {validationResult.warnings.length > 0 && (
                    <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </Box>
                  )}
                </Alert>
              ) : (
                <Alert severity="error">
                  <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </Box>
                </Alert>
              )}
            </Box>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Stats
              </Typography>
              {stats ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Characters
                    </Typography>
                    <Typography variant="h6">{stats.characters}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Words
                    </Typography>
                    <Typography variant="h6">{stats.words}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Images
                    </Typography>
                    <Typography variant="h6">{stats.images}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Tables
                    </Typography>
                    <Typography variant="h6">{stats.tables}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Formulas
                    </Typography>
                    <Typography variant="h6">{stats.formulas}</Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="textSecondary">
                  Content stats will appear after validation
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Tabs value={tab} onChange={handleTabChange}>
                <Tab label="HTML" />
                <Tab label="JSON" />
              </Tabs>

              <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
                {tab === 0 ? (
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      maxHeight: 300,
                      overflow: 'auto',
                    }}
                  >
                    {sanitizeHtml(content.html) || 'No content'}
                  </Box>
                ) : (
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      maxHeight: 300,
                      overflow: 'auto',
                    }}
                  >
                    {content.json ? JSON.stringify(content.json, null, 2) : 'No content'}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditorDemo;