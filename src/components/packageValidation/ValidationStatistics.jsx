/* eslint-disable no-unused-vars */
/**
 * ValidationStatistics Component
 * Displays validation statistics charts
 * 
 * Location: src/components/packageValidation/ValidationStatistics.jsx
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

const COLORS = ['#2e7d32', '#ed6c02', '#d32f2f', '#1976d2', '#6c757d'];

const ValidationStatistics = ({
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
    byStatus,
    successRate,
    failureReasons,
    timeline
  } = data;

  // Prepare status data for pie chart
  const statusData = byStatus ? Object.entries(byStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : [];

  return (
    <Grid container spacing={2}>
      {/* Status Distribution */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Validation Status
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

      {/* Success Rate */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Success Rate
          </Typography>
          <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color={successRate >= 80 ? 'success.main' : successRate >= 60 ? 'warning.main' : 'error.main'}>
                {Math.round(successRate || 0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of validations passed
              </Typography>
            </Box>
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

      {/* Validation Timeline */}
      {timeline && timeline.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Validation Timeline
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
                    dataKey="validated"
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

export default ValidationStatistics;