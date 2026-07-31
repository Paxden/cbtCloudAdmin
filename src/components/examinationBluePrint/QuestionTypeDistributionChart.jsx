/**
 * Question Type Distribution Chart Component
 * Displays question type distribution as a pie chart
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
  SINGLE_CHOICE: '#2196f3',
  MULTIPLE_CHOICE: '#ff5722',
  TRUE_FALSE: '#4caf50',
  FILL_IN: '#ff9800',
  MATCHING: '#9c27b0',
  ESSAY: '#795548',
};

const QUESTION_TYPE_LABELS = {
  SINGLE_CHOICE: 'Single Choice',
  MULTIPLE_CHOICE: 'Multiple Choice',
  TRUE_FALSE: 'True/False',
  FILL_IN: 'Fill in the Blank',
  MATCHING: 'Matching',
  ESSAY: 'Essay',
};

const QuestionTypeDistributionChart = ({ distributions, title = 'Question Type Distribution', loading }) => {
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
        <Typography color="textSecondary">No question type data available</Typography>
      </Paper>
    );
  }

  const data = distributions.map(d => ({
    name: QUESTION_TYPE_LABELS[d.questionType] || d.questionType || d.name,
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

export default QuestionTypeDistributionChart;