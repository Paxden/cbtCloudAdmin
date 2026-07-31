/* eslint-disable no-unused-vars */
/**
 * Centre Capacity Card Component
 * Displays centre capacity information with location
 */

import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import { LocationOn as LocationIcon, CheckCircle as ActiveIcon } from '@mui/icons-material';

const CentreCapacityCard = ({ centre, onSelect, selected }) => {
  const {
    _id,
    name,
    code,
    capacity,
    assignedCandidates = 0,
    candidateCount = 0,
    status,
    address,
    utilization = 0,
    isFull = false,
  } = centre;

  // Use either assignedCandidates or candidateCount
  const assigned = assignedCandidates || candidateCount || 0;
  const totalCapacity = capacity || 0;
  const available = totalCapacity - assigned;
  const occupancy = totalCapacity > 0 ? (assigned / totalCapacity) * 100 : 0;

  // Determine status color
  const getStatusColor = () => {
    if (status !== 'ACTIVE') return 'default';
    if (isFull || occupancy >= 100) return 'error';
    if (occupancy >= 80) return 'warning';
    return 'success';
  };

  const getStatusLabel = () => {
    if (status !== 'ACTIVE') return 'Inactive';
    if (isFull || occupancy >= 100) return 'Full';
    if (occupancy >= 80) return 'Near Capacity';
    return 'Available';
  };

  // Get location display
  const locationDisplay = address?.city || address?.state || 'Location not set';

  return (
    <Card
      sx={{
        cursor: 'pointer',
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'visible',
      }}
      onClick={() => onSelect?.(centre)}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {code}
            </Typography>
          </Box>
          <Chip
            label={getStatusLabel()}
            size="small"
            color={getStatusColor()}
            variant="outlined"
          />
        </Stack>

        {/* Location */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="caption" color="textSecondary">
            {locationDisplay}
          </Typography>
          {address?.state && (
            <Typography variant="caption" color="textSecondary">
              • {address.state}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="caption" color="textSecondary">
                Capacity
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {totalCapacity || 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Assigned
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {assigned}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Available
              </Typography>
              <Typography variant="h6" fontWeight={600} color={available > 0 ? 'success.main' : 'error.main'}>
                {Math.max(0, available)}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(occupancy, 100)}
              color={getStatusColor()}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
              {Math.round(occupancy)}% occupancy
            </Typography>
          </Box>
        </Box>

        {/* Selected indicator */}
        {selected && (
          <Box
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActiveIcon sx={{ color: 'white', fontSize: 14 }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CentreCapacityCard;