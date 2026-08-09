/* eslint-disable no-unused-vars */
/**
 * InstanceSelector Component
 * Displays ready examination instances for selection
 * 
 * Location: src/components/packages/InstanceSelector.jsx
 */

import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Radio,
  Box,
  Typography,
  Skeleton,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import InstanceStatusChip from '../instances/InstanceStatusChip';

const InstanceSelector = ({
  instances,
  total,
  page,
  limit,
  loading = false,
  selectedInstanceId,
  onSelect,
  onPageChange,
  onRowsPerPageChange,
  onSearch,
  searchValue = ''
}) => {
  const handlePageChange = (event, newPage) => {
    onPageChange(event, newPage);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(event);
  };

  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  // Loading state
  if (loading) {
    return (
      <Paper>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
        </Box>
      </Paper>
    );
  }

  // Empty state
  if (instances.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No ready examination instances found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please ensure you have at least one instance with GENERATED or LOCKED status
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by instance code or examination name..."
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Select</TableCell>
              <TableCell>Instance Code</TableCell>
              <TableCell>Examination</TableCell>
              <TableCell>Version</TableCell>
              <TableCell align="center">Candidates</TableCell>
              <TableCell align="center">Centres</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.map((instance) => {
              const isSelected = selectedInstanceId === instance._id;
              
              return (
                <TableRow
                  key={instance._id}
                  hover
                  selected={isSelected}
                  onClick={() => onSelect(instance)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Radio
                      checked={isSelected}
                      onChange={() => onSelect(instance)}
                      value={instance._id}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {instance.instanceCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{instance.examName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {instance.examCode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>V{instance.examVersion || 1}</TableCell>
                  <TableCell align="center">{instance.candidateCount || 0}</TableCell>
                  <TableCell align="center">{instance.centreCount || 0}</TableCell>
                  <TableCell>
                    <InstanceStatusChip status={instance.status} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(instance.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(instance.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );
};

export default InstanceSelector;