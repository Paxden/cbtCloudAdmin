
/**
 * Stats Card Grid Component
 * Grid of statistics cards
 */

import { Grid } from '@mui/material';
import StatsCard from '../cards/StatsCard';
import {
  QuestionAnswer as QuestionIcon,
  CheckCircle as PublishedIcon,
  Pending as PendingIcon,
  Edit as DraftIcon,
  Category as CategoryIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';

const STATS_CONFIG = [
  {
    key: 'totalQuestions',
    title: 'Total Questions',
    icon: QuestionIcon,
    color: 'primary',
  },
  {
    key: 'publishedQuestions',
    title: 'Published',
    icon: PublishedIcon,
    color: 'success',
  },
  {
    key: 'pendingReviews',
    title: 'Pending Reviews',
    icon: PendingIcon,
    color: 'warning',
  },
  {
    key: 'draftQuestions',
    title: 'Draft',
    icon: DraftIcon,
    color: 'info',
  },
  {
    key: 'categories',
    title: 'Categories',
    icon: CategoryIcon,
    color: 'secondary',
  },
  {
    key: 'subjects',
    title: 'Subjects',
    icon: SubjectIcon,
    color: 'default',
  },
];

const StatsCardGrid = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {STATS_CONFIG.map((config) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={config.key}>
          <StatsCard
            title={config.title}
            value={stats?.[config.key] ?? 0}
            icon={config.icon}
            color={config.color}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCardGrid;