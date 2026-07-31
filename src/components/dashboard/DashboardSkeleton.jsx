/**
 * Dashboard Skeleton Component
 * Loading state for dashboard
 */

import { Grid, Paper, Skeleton, Box } from '@mui/material';

const DashboardSkeleton = () => {
  return (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="80%" />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="30%" height={30} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 1 }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="30%" height={30} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 1 }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="30%" height={30} />
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="30%" height={30} />
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;