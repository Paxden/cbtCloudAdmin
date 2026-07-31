/**
 * Question Status Chart Component
 * Pie chart showing question status distribution
 */

import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  DRAFT: '#ed6c02',
  PENDING_REVIEW: '#0288d1',
  APPROVED: '#1976d2',
  PUBLISHED: '#2e7d32',
  REJECTED: '#d32f2f',
  ARCHIVED: '#9e9e9e',
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
  const chartData = data?.byStatus
    ? Object.entries(data.byStatus).map(([key, value]) => ({
        name: STATUS_LABELS[key] || key,
        value: value,
        color: COLORS[key] || '#9e9e9e',
      }))
    : [];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>
          Question Status Distribution
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="textSecondary">Loading chart...</Typography>
        </Box>
      </Paper>
    );
  }

  if (chartData.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>
          Question Status Distribution
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="textSecondary">No data available</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: 380 }}>
      <Typography variant="h6" gutterBottom>
        Question Status Distribution
      </Typography>
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