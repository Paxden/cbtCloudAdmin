/* eslint-disable no-unused-vars */
/**
 * Question Growth Chart Component
 * Displays question growth over time
 */

import { Paper, Typography, Box, FormControl, Select, MenuItem, Skeleton } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const QuestionGrowthChart = ({ data, loading, interval, onIntervalChange }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Question Growth</Typography>
        </Box>
        <Skeleton variant="rectangular" height={280} />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Question Growth</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
          <Typography color="textSecondary">No growth data available</Typography>
        </Box>
      </Paper>
    );
  }

  const handleIntervalChange = (event) => {
    if (onIntervalChange) {
      onIntervalChange(event.target.value);
    }
  };

  const formatDate = (item) => {
    if (interval === 'daily') {
      return item.date;
    }
    if (interval === 'monthly') {
      return item.date;
    }
    return item.date;
  };

  return (
    <Paper sx={{ p: 3, height: 380 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Question Growth</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value={interval || 'monthly'} onChange={handleIntervalChange}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: 'none',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="count"
            name="Questions"
            fill="#1976d2"
            stroke="#1976d2"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default QuestionGrowthChart;