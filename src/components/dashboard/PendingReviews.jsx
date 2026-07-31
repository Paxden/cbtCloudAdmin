/**
 * Pending Reviews Component
 * List of questions pending review
 */

import { Paper, Typography, List, ListItem, ListItemText, Chip, Box, Button, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PendingReviews = ({ reviews, loading, onViewAll }) => {
  const navigate = useNavigate();

  const handleReview = (questionId) => {
    navigate(`/question-bank/questions/${questionId}/review`);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Pending Reviews
        </Typography>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ py: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ))}
      </Paper>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Pending Reviews</Typography>
          {onViewAll && (
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={onViewAll}>
              View All
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="textSecondary">No pending reviews</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Pending Reviews</Typography>
        {onViewAll && (
          <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={onViewAll}>
            View All
          </Typography>
        )}
      </Box>
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {reviews.slice(0, 10).map((review) => (
          <ListItem key={review._id || review.id} divider>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {review.question?.questionCode || 'Untitled'}
                  </Typography>
                  <Chip label={review.subject?.name || 'No Subject'} size="small" variant="outlined" />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    By: {review.author?.name || 'Unknown'} • Submitted: {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                  </Typography>
                </Box>
              }
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleReview(review.question?._id || review.questionId)}
            >
              Review
            </Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PendingReviews;