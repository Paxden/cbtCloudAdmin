/**
 * Candidate Preview Card Component
 * Preview instructions as candidates would see them
 */

import  { useState } from 'react';
import {
  Paper,
  Typography,
  Stack,
  Chip,
  Divider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ValidIcon,
} from '@mui/icons-material';
import DOMPurify from 'dompurify';

const CandidatePreviewCard = ({
  instructions,
  resources,
  loading,
  onPreview,
  previewData,
  previewLoading,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = async () => {
    if (!previewData) {
      await onPreview();
    }
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const renderPreviewContent = () => {
    if (previewLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!previewData) {
      return (
        <Alert severity="info">
          No instructions available for preview. Please add instructions first.
        </Alert>
      );
    }

    return (
      <Box>
        {/* Welcome Message */}
        {previewData.welcomeMessage && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Welcome
            </Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(previewData.welcomeMessage),
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Examination Overview */}
        {previewData.overview && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Examination Overview
            </Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(previewData.overview),
              }}
            />
          </Box>
        )}

        {/* Candidate Responsibilities */}
        {previewData.responsibilities && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Your Responsibilities
            </Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(previewData.responsibilities),
              }}
            />
          </Box>
        )}

        {/* Submission Instructions */}
        {previewData.submissionInstructions && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Submission Instructions
            </Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(previewData.submissionInstructions),
              }}
            />
          </Box>
        )}

        {/* Warning Messages */}
        {previewData.warningMessages && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="warning">
              <Typography variant="subtitle2" fontWeight={600}>
                Important Warnings
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(previewData.warningMessages),
                }}
              />
            </Alert>
          </Box>
        )}

        {/* Completion Message */}
        {previewData.completionMessage && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              After Submission
            </Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(previewData.completionMessage),
              }}
            />
          </Box>
        )}

        {/* Resources */}
        {resources && resources.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Examination Resources
            </Typography>
            <Stack spacing={1}>
              {resources.map((resource) => (
                <Paper key={resource._id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={500}>
                        {resource.name || resource.filename}
                      </Typography>
                      <Chip
                        label={resource.fileType?.split('/').pop() || 'Unknown'}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Button size="small" variant="outlined">
                      View
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Candidate Preview
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Preview instructions as candidates will see them
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<ViewIcon />}
            onClick={handlePreview}
            disabled={loading}
          >
            Preview
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            icon={instructions?.welcomeMessage ? <ValidIcon color="success" /> : undefined}
            label={instructions?.welcomeMessage ? 'Welcome Message Set' : 'Missing Welcome Message'}
            color={instructions?.welcomeMessage ? 'success' : 'default'}
            variant="outlined"
          />
          <Chip
            icon={instructions?.submissionInstructions ? <ValidIcon color="success" /> : undefined}
            label={instructions?.submissionInstructions ? 'Submission Instructions Set' : 'Missing Submission Instructions'}
            color={instructions?.submissionInstructions ? 'success' : 'default'}
            variant="outlined"
          />
          <Chip
            icon={instructions?.completionMessage ? <ValidIcon color="success" /> : undefined}
            label={instructions?.completionMessage ? 'Completion Message Set' : 'Missing Completion Message'}
            color={instructions?.completionMessage ? 'success' : 'default'}
            variant="outlined"
          />
          <Chip
            label={`${resources?.length || 0} Resources`}
            color="info"
            variant="outlined"
          />
        </Stack>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Candidate Preview</Typography>
            <Button size="small" onClick={handleClosePreview}>
              Close
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ overflow: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
            {renderPreviewContent()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CandidatePreviewCard;