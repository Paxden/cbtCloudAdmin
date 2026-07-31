/**
 * Question Type Distribution Chart Component
 * Displays questions by type
 */

import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QuestionTypeDistributionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Question Type Distribution</Typography>
        <Skeleton variant="rectangular" height={280} />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Question Type Distribution</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Typography color="textSecondary">No question type data available</Typography>
        </Box>
      </Paper>
    );
  }

  const chartData = data.map((item) => ({
    name: item.typeName || item._id || 'Unknown',
    count: item.count || 0,
  }));

  return (
    <Paper sx={{ p: 3, height: 380 }}>
      <Typography variant="h6" gutterBottom>Question Type Distribution</Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} questions`, 'Count']}
            contentStyle={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: 'none',
            }}
          />
          <Bar dataKey="count" fill="#9c27b0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default QuestionTypeDistributionChart;