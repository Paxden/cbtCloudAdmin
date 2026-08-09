/**
 * Package Status Chart Component
 * 
 * Displays package status distribution using a pie chart
 * 
 * Props:
 * - data: Status statistics data
 * - loading: Loading state
 * - error: Error state
 * 
 * Location: src/components/packages/PackageStatusChart.jsx
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = {
  DRAFT: '#B0BEC5',
  GENERATING: '#FFB74D',
  GENERATED: '#4FC3F7',
  ENCRYPTED: '#4DD0E1',
  SIGNED: '#81C784',
  VALIDATED: '#66BB6A',
  READY_FOR_DISTRIBUTION: '#FFD54F',
  DOWNLOADED: '#CE93D8',
  EXPIRED: '#EF5350',
  REVOKED: '#E53935',
  FAILED: '#FF8A65',
  ARCHIVED: '#78909C',
};

const STATUS_LABELS = {
  DRAFT: 'Draft',
  GENERATING: 'Generating',
  GENERATED: 'Generated',
  ENCRYPTED: 'Encrypted',
  SIGNED: 'Signed',
  VALIDATED: 'Validated',
  READY_FOR_DISTRIBUTION: 'Ready',
  DOWNLOADED: 'Downloaded',
  EXPIRED: 'Expired',
  REVOKED: 'Revoked',
  FAILED: 'Failed',
  ARCHIVED: 'Archived',
};

const PackageStatusChart = ({ data, loading, error }) => {
  const chartData = data?.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    status: item.status,
  })) || [];

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: entry.color, marginRight: 4, borderRadius: 2 }} />
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

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
        <CardHeader title="Packages by Status" />
        <CardContent>
          <Typography color="error">Failed to load status statistics</Typography>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader title="Packages by Status" />
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
      <CardHeader title="Packages by Status" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#B0BEC5'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} packages`, name]}
            />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PackageStatusChart;