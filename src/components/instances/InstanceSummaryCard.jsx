/* eslint-disable no-unused-vars */
/**
 * Instance Summary Card Component
 * 
 * Displays a summary card for an examination instance
 * 
 * Props:
 * - instance: Instance data
 * - onClick: Click handler
 * 
 * Location: src/components/packages/instance/InstanceSummaryCard.jsx
 */

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import InstanceStatusChip from './InstanceStatusChip';

const InstanceSummaryCard = ({ instance, onClick }) => {
  const theme = useTheme();

  if (!instance) return null;

  const isLocked = instance.status === 'LOCKED';
  const isReady = instance.status === 'GENERATED';

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
      }}
      onClick={() => onClick?.(instance._id)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {instance.instanceCode}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {instance.examName}
            </Typography>
          </Box>
          <InstanceStatusChip status={instance.status} size="small" />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SchoolIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {instance.examCode}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {instance.candidateCount || 0} candidates
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {instance.centreCount || 0} centres
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {dayjs(instance.createdAt).format('DD MMM YYYY')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {(isLocked || isReady) && (
          <Box sx={{ mt: 2 }}>
            <Chip
              size="small"
              label={isLocked ? 'Locked - Ready for Packages' : 'Ready - Can be Locked'}
              color={isLocked ? 'success' : 'info'}
              icon={isLocked ? <LockIcon /> : <CheckCircleIcon />}
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InstanceSummaryCard;