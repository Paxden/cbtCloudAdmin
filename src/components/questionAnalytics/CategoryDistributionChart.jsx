/**
 * Category Distribution Chart Component
 * Bar chart showing questions by category
 */

import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CategoryDistributionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Category Distribution</Typography>
        <Skeleton variant="rectangular" height={280} />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Typography variant="h6" gutterBottom>Category Distribution</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Typography color="textSecondary">No category data available</Typography>
        </Box>
      </Paper>
    );
  }

  // Truncate long names
  const chartData = data.map((item) => ({
    ...item,
    name: item.categoryName?.length > 15 ? `${item.categoryName.substring(0, 15)}...` : item.categoryName,
    fullName: item.categoryName,
    count: item.count || 0,
  }));

  return (
    <Paper sx={{ p: 3, height: 380 }}>
      <Typography variant="h6" gutterBottom>Category Distribution</Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} questions`, 'Count']}
            labelFormatter={(label) => {
              const item = chartData.find((d) => d.name === label);
              return item?.fullName || label;
            }}
            contentStyle={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: 'none',
            }}
          />
          <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryDistributionChart;