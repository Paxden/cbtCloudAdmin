/* eslint-disable no-unused-vars */
/**
 * CandidatePaperStatistics Component
 * Displays statistics charts for candidate papers
 * 
 * Location: src/components/packages/CandidatePaperStatistics.jsx
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
  Area,
  AreaChart
} from 'recharts';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#6c757d', '#0288d1'];

const CandidatePaperStatistics = ({
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
    byCentre,
    questionDistribution,
    generationTimeline
  } = data;

  // Prepare status data for pie chart
  const statusData = byStatus ? Object.entries(byStatus).map(([name, value]) => ({
    name,
    value
  })) : [];

  // Prepare centre data for bar chart
  const centreData = byCentre || [];

  return (
    <Grid container spacing={2}>
      {/* Status Distribution */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Papers by Status
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

      {/* Centre Distribution */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Papers by Centre
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

      {/* Question Distribution */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Question Distribution
          </Typography>
          <Box sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2e7d32" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Generation Timeline */}
      {generationTimeline && generationTimeline.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Generation Timeline
            </Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generationTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stackId="1"
                    stroke="#1976d2"
                    fill="#1976d2"
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

export default CandidatePaperStatistics;