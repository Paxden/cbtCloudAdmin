/**
 * Quick Action Cards Component
 * 
 * Displays navigation shortcut cards for package management
 * 
 * Props:
 * - user: Authenticated user object
 * 
 * Location: src/components/packages/QuickActionCards.jsx
 */

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  AddBox as GenerateIcon,
  Verified as ValidateIcon,
  CloudUpload as DistributeIcon,
  Download as DownloadsIcon,
  Timeline as VersionsIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

const ActionCard = ({ title, icon, color, bgColor, path, description }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Tooltip title={description || title} arrow>
      <Card
        sx={{
          height: '100%',
          cursor: path ? 'pointer' : 'default',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': path ? {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          } : {},
        }}
        onClick={handleClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: bgColor || theme.palette.primary.light,
                color: color || theme.palette.primary.main,
                width: 48,
                height: 48,
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="medium">
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Tooltip>
  );
};

const QuickActionCards = ({ user }) => {
  const theme = useTheme();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'TECH_ADMIN';

  const actions = [
    {
      title: 'Generate Package',
      icon: <GenerateIcon />,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
      path: '/packages/generate',
      description: 'Create new examination packages',
      show: isAdmin,
    },
    {
      title: 'Package Validation',
      icon: <ValidateIcon />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
      path: '/packages/validation',
      description: 'Validate package integrity',
      show: isAdmin,
    },
    {
      title: 'Distribution',
      icon: <DistributeIcon />,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
      path: '/packages/distribution',
      description: 'Assign packages to centres',
      show: true,
    },
    {
      title: 'Downloads',
      icon: <DownloadsIcon />,
      color: theme.palette.secondary.main,
      bgColor: theme.palette.secondary.light,
      path: '/packages/downloads',
      description: 'Track package downloads',
      show: true,
    },
    {
      title: 'Versions',
      icon: <VersionsIcon />,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      path: '/packages/versions',
      description: 'Manage package versions',
      show: isAdmin,
    },
    {
      title: 'History',
      icon: <HistoryIcon />,
      color: theme.palette.grey[600],
      bgColor: theme.palette.grey[200],
      path: '/packages/history',
      description: 'View package audit trail',
      show: true,
    },
  ];

  const visibleActions = actions.filter(action => action.show !== false);

  return (
    <Grid container spacing={2}>
      {visibleActions.map((action, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ActionCard {...action} />
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickActionCards;