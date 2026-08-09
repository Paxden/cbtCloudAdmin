/**
 * Package Summary Cards Component
 * 
 * Displays KPI cards for package statistics
 * 
 * Props:
 * - data: Summary statistics object
 * - loading: Loading state
 * - error: Error state
 * 
 * Location: src/components/packages/PackageSummaryCards.jsx
 */

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
   Inventory as PackageIcon,
  CheckCircle as CheckCircleIcon,
  CloudDownload as DownloadIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const SummaryCard = ({ title, value, icon, color, bgColor, tooltip, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="medium">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 0.5 }}>
              {value ?? 0}
            </Typography>
          </Box>
          <Tooltip title={tooltip || title}>
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
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const PackageSummaryCards = ({ data, loading, error }) => {
  const theme = useTheme();

  const cards = [
    {
      title: 'Validated Examinations',
      value: data?.validatedExaminations,
      icon: <VerifiedIcon />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
      tooltip: 'Examinations validated and ready for packaging',
    },
    {
      title: 'Packages Generated',
      value: data?.packagesGenerated,
      icon: <PackageIcon />,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
      tooltip: 'Total packages generated',
    },
    {
      title: 'Packages Ready',
      value: data?.packagesReady,
      icon: <CheckCircleIcon />,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
      tooltip: 'Packages ready for distribution',
    },
    {
      title: 'Downloaded',
      value: data?.downloaded,
      icon: <DownloadIcon />,
      color: theme.palette.secondary.main,
      bgColor: theme.palette.secondary.light,
      tooltip: 'Packages downloaded by centres',
    },
    {
      title: 'Expired',
      value: data?.expired,
      icon: <ScheduleIcon />,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      tooltip: 'Packages that have expired',
    },
    {
      title: 'Revoked',
      value: data?.revoked,
      icon: <CancelIcon />,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light,
      tooltip: 'Packages that have been revoked',
    },
  ];

  if (error) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Failed to load summary statistics</Typography>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <SummaryCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
            tooltip={card.tooltip}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PackageSummaryCards;