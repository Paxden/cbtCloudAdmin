/**
 * Question Distribution Chart Component
 * Bar chart showing questions by category/subject/difficulty/type
 */

import { Paper, Typography, Box, FormControl, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DISTRIBUTION_TYPES = [
  { value: 'category', label: 'By Category' },
  { value: 'subject', label: 'By Subject' },
  { value: 'difficulty', label: 'By Difficulty' },
  { value: 'type', label: 'By Question Type' },
];

const QuestionDistributionChart = ({
  data,
  loading,
  type = 'category',
  onTypeChange,
}) => {
  const chartData = data || [];

  const handleTypeChange = (event) => {
    if (onTypeChange) {
      onTypeChange(event.target.value);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Question Distribution</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Typography color="textSecondary">Loading chart...</Typography>
        </Box>
      </Paper>
    );
  }

  if (chartData.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Question Distribution</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Typography color="textSecondary">No data available</Typography>
        </Box>
      </Paper>
    );
  }

  // Truncate long names for display
  const truncatedData = chartData.map((item) => ({
    ...item,
    name: item.name?.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
    fullName: item.name,
  }));

  return (
    <Paper sx={{ p: 3, height: 380 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Question Distribution</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={type} onChange={handleTypeChange}>
            {DISTRIBUTION_TYPES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={truncatedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} questions`, 'Count']}
            labelFormatter={(label) => {
              const item = chartData.find((d) => d.name === label || d.name === label.replace('...', ''));
              return item?.fullName || label;
            }}
            contentStyle={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: 'none',
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default QuestionDistributionChart;