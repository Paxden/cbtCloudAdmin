/**
 * Stats Card Component
 * Dashboard statistics card
 */

import { Paper, Box, Typography, Skeleton } from '@mui/material';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  loading = false,
  subtitle,
  trend,
  trendDirection = 'up',
  sx = {},
}) => {
  if (loading) {
    return (
      <Paper
        sx={{
          p: 3,
          height: '100%',
          borderLeft: `4px solid ${color}.main`,
          ...sx,
        }}
      >
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" height={40} />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        borderLeft: `4px solid ${color}.main`,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Typography
              variant="caption"
              color={trendDirection === 'up' ? 'success.main' : 'error.main'}
              sx={{ display: 'block', mt: 0.5 }}
            >
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </Typography>
          )}
        </Box>
        {Icon && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              color: `${color}.main`,
            }}
          >
            <Icon />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatsCard;