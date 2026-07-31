/**
 * Difficulty Distribution Chart Component
 * Displays questions by difficulty level
 */

import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DIFFICULTY_COLORS = {
  Easy: '#4caf50',
  Medium: '#ff9800',
  Hard: '#f44336',
  Expert: '#9c27b0',
};

const DifficultyDistributionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Difficulty Distribution</Typography>
        <Skeleton variant="rectangular" height={280} />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Difficulty Distribution</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Typography color="textSecondary">No difficulty data available</Typography>
        </Box>
      </Paper>
    );
  }

  const chartData = data.map((item) => ({
    name: item.difficultyName || item._id || 'Unknown',
    value: item.count || 0,
    color: DIFFICULTY_COLORS[item.difficultyName] || '#9e9e9e',
  }));

  return (
    <Paper sx={{ p: 3, height: 380 }}>
      <Typography variant="h6" gutterBottom>Difficulty Distribution</Typography>

      <ResponsiveContainer width="100%" height={300}>
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DifficultyDistributionChart;