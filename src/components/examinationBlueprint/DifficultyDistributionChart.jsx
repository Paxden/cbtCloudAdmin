/**
 * Difficulty Distribution Chart Component
 * Displays difficulty distribution as a pie chart
 */

import { Paper, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = {
  EASY: '#4caf50',
  MEDIUM: '#ff9800',
  HARD: '#f44336',
  EXPERT: '#9c27b0',
};

const DifficultyDistributionChart = ({ distributions, title = 'Difficulty Distribution', loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="textSecondary">Loading chart...</Typography>
      </Paper>
    );
  }

  if (!distributions || distributions.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="textSecondary">No difficulty data available</Typography>
      </Paper>
    );
  }

  const data = distributions.map(d => ({
    name: d.difficulty || d.name,
    value: d.percentage || d.value || 0,
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const isValid = Math.round(total) === 100;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        {!isValid && (
          <Typography variant="caption" color="error">
            Total: {total}% {total !== 100 && '(should be 100%)'}
          </Typography>
        )}
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DifficultyDistributionChart;