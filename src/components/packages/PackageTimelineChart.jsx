/**
 * Package Timeline Chart Component
 * 
 * Displays package generation trend using a line chart
 * 
 * Props:
 * - data: Timeline data
 * - loading: Loading state
 * - error: Error state
 * 
 * Location: src/components/packages/PackageTimelineChart.jsx
 */

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PackageTimelineChart = ({ data, loading, error }) => {
  const chartData = data?.map(item => ({
    date: item.date,
    count: item.count,
    cumulative: item.cumulative || 0,
  })) || [];

  if (loading) {
    return (
      <Card>
        <CardHeader title={<Skeleton width={200} />} />
        <CardContent>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Package Generation Timeline" />
        <CardContent>
          <Typography color="error">Failed to load timeline data</Typography>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader title="Package Generation Timeline" />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Package Generation Timeline" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1976D2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'New Packages') return [`${value} packages`, 'New'];
                if (name === 'Cumulative') return [`${value} packages`, 'Cumulative'];
                return [value, name];
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1976D2"
              fill="url(#colorCount)"
              yAxisId="left"
              name="New Packages"
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#2E7D32"
              fill="url(#colorCumulative)"
              yAxisId="right"
              name="Cumulative"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PackageTimelineChart;