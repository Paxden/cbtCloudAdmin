/* eslint-disable no-unused-vars */
/**
 * DownloadStatistics Component
 * Displays download statistics charts
 * 
 * Location: src/components/packageDownloads/DownloadStatistics.jsx
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Skeleton
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#2e7d32', '#d32f2f', '#ed6c02', '#1976d2', '#6c757d'];

const DownloadStatistics = ({
  data,
  loading = false
}) => {
  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!data) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No statistics data available
        </Typography>
      </Paper>
    );
  }

  const {
    byCentre,
    successRate,
    failureReasons,
    timeline
  } = data;

  // Prepare centre data for bar chart
  const centreData = byCentre || [];

  // Prepare status data for pie chart
  const statusData = [
    { name: 'Success', value: successRate?.success || 0 },
    { name: 'Failed', value: successRate?.failed || 0 },
    { name: 'Pending', value: successRate?.pending || 0 }
  ];

  return (
    <Grid container spacing={2}>
      {/* Downloads by Centre */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Downloads by Centre
          </Typography>
          <Box sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Download Success Rate */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Download Status
          </Typography>
          <Box sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Failure Reasons */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Failure Reasons
          </Typography>
          <Box sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={failureReasons || []}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#d32f2f" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Download Timeline */}
      {timeline && timeline.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Download Timeline
            </Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="successful"
                    stackId="1"
                    stroke="#2e7d32"
                    fill="#2e7d32"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    stackId="1"
                    stroke="#d32f2f"
                    fill="#d32f2f"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default DownloadStatistics;