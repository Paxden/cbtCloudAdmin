/**
 * Question Status Chart Component
 * Displays status distribution as pie chart
 */

import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  DRAFT: '#9e9e9e',
  PENDING_REVIEW: '#ed6c02',
  APPROVED: '#1976d2',
  PUBLISHED: '#2e7d32',
  REJECTED: '#d32f2f',
  ARCHIVED: '#757575',
};

const STATUS_LABELS = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
};

const QuestionStatusChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Status Distribution</Typography>
        <Skeleton variant="rectangular" height={280} />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Status Distribution</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Typography color="textSecondary">No status data available</Typography>
        </Box>
      </Paper>
    );
  }

  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item._id] || item._id,
    value: item.count,
    color: COLORS[item._id] || '#9e9e9e',
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Paper sx={{ p: 3, height: 380 }}>
      <Typography variant="h6" gutterBottom>Status Distribution</Typography>
      <Typography variant="caption" color="textSecondary">
        Total: {total} questions
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} questions`, 'Count']}
            contentStyle={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: 'none',
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry) => (
              <span style={{ fontSize: '0.75rem' }}>
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default QuestionStatusChart;