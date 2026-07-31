/**
 * Dashboard Page
 * Main admin dashboard
 */

import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Category as CategoryIcon,
  QuestionAnswer as QuestionIcon,
  People as PeopleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Manage Categories',
      description: 'Create and manage question categories',
      icon: <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/question-bank/categories',
    },
    {
      title: 'Manage Subjects',
      description: 'Create and manage subjects',
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      path: '/question-bank/subjects',
    },
    {
      title: 'Manage Topics',
      description: 'Create and manage topics',
      icon: <QuestionIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      path: '/question-bank/topics',
    },
    {
      title: 'Users',
      description: 'Manage system users',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      path: '/users',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Welcome to the CBT Platform Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.title}>
            <Card
              sx={{
                height: '100%',
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
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box sx={{ mb: 2 }}>{action.icon}</Box>
                <Typography variant="h6" fontWeight={600}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Question Bank Statistics
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Statistics will be displayed here after data is available.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CategoryIcon />}
            onClick={() => navigate('/question-bank/categories')}
          >
            Go to Categories
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;