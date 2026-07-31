/**
 * Quick Actions Component
 * Quick action cards for common tasks
 */

import { Paper, Grid, Card, CardContent, Typography,  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Category as CategoryIcon,
  Subject as SubjectIcon,
  Topic as TopicIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  LibraryBooks as MediaIcon,
} from '@mui/icons-material';

const QUICK_ACTIONS = [
  {
    id: 'new-question',
    title: 'New Question',
    icon: AddIcon,
    path: '/question-bank/questions/new',
    color: '#1976d2',
  },
  {
    id: 'categories',
    title: 'Categories',
    icon: CategoryIcon,
    path: '/question-bank/categories',
    color: '#2e7d32',
  },
  {
    id: 'subjects',
    title: 'Subjects',
    icon: SubjectIcon,
    path: '/question-bank/subjects',
    color: '#ed6c02',
  },
  {
    id: 'topics',
    title: 'Topics',
    icon: TopicIcon,
    path: '/question-bank/topics',
    color: '#9c27b0',
  },
  {
    id: 'bulk-import',
    title: 'Bulk Import',
    icon: UploadIcon,
    path: '/question-bank/import',
    color: '#0288d1',
  },
  {
    id: 'statistics',
    title: 'Statistics',
    icon: AssessmentIcon,
    path: '/question-bank/statistics',
    color: '#00796b',
  },
  {
    id: 'media',
    title: 'Media Library',
    icon: MediaIcon,
    path: '/question-bank/media',
    color: '#e65100',
  },
];

const QuickActions = ({ loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[...Array(7)].map((_, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card sx={{ height: 80 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="caption" color="textSecondary">Loading...</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Grid item xs={6} sm={4} md={3} key={action.id}>
              <Card
                sx={{
                  height: 80,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    height: '100%',
                    gap: 0.5,
                  }}
                >
                  <Icon sx={{ color: action.color }} />
                  <Typography variant="caption" fontWeight={500}>
                    {action.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default QuickActions;