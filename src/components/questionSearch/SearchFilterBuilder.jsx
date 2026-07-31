/* eslint-disable no-unused-vars */
/**
 * Search Filter Builder Component
 * Builds complex filters with AND/OR/NOT logic
 */

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  TextField,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

const CONDITIONS = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
];

const FIELDS = [
  { value: 'questionText', label: 'Question Text' },
  { value: 'questionCode', label: 'Question Code' },
  { value: 'explanation', label: 'Explanation' },
  { value: 'reference', label: 'Reference' },
  { value: 'tags', label: 'Tags' },
];

const SearchFilterBuilder = ({ filters, onFiltersChange, onClose }) => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      logic: 'AND',
      conditions: [
        { field: 'questionText', condition: 'contains', value: '' },
      ],
    },
  ]);

  const addGroup = () => {
    const newGroup = {
      id: Date.now(),
      logic: 'AND',
      conditions: [{ field: 'questionText', condition: 'contains', value: '' }],
    };
    setGroups([...groups, newGroup]);
  };

  const removeGroup = (groupId) => {
    if (groups.length === 1) return;
    setGroups(groups.filter((g) => g.id !== groupId));
  };

  const addCondition = (groupId) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: [
              ...group.conditions,
              { field: 'questionText', condition: 'contains', value: '' },
            ],
          };
        }
        return group;
      })
    );
  };

  const removeCondition = (groupId, index) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const conditions = group.conditions.filter((_, i) => i !== index);
          return { ...group, conditions };
        }
        return group;
      })
    );
  };

  const updateCondition = (groupId, index, key, value) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const conditions = [...group.conditions];
          conditions[index] = { ...conditions[index], [key]: value };
          return { ...group, conditions };
        }
        return group;
      })
    );
  };

  const updateGroupLogic = (groupId, logic) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, logic };
        }
        return group;
      })
    );
  };

  const applyFilters = () => {
    // Convert groups to filter object
    // This is a simplified version - in production, you'd build a proper query
    const filters = {};
    groups.forEach((group) => {
      group.conditions.forEach((condition) => {
        if (condition.value && condition.value.trim()) {
          const key = condition.field;
          if (!filters[key]) {
            filters[key] = [];
          }
          filters[key].push({
            condition: condition.condition,
            value: condition.value,
            logic: group.logic,
          });
        }
      });
    });
    onFiltersChange(filters);
  };

  const resetFilters = () => {
    setGroups([
      {
        id: 1,
        logic: 'AND',
        conditions: [{ field: 'questionText', condition: 'contains', value: '' }],
      },
    ]);
    onFiltersChange({});
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Advanced Filter Builder
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {groups.map((group, groupIndex) => (
        <Box
          key={group.id}
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              Group {groupIndex + 1}
            </Typography>
            <Box>
              {groups.length > 1 && (
                <IconButton size="small" onClick={() => removeGroup(group.id)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Logic</InputLabel>
              <Select
                value={group.logic}
                onChange={(e) => updateGroupLogic(group.id, e.target.value)}
                label="Logic"
              >
                <MenuItem value="AND">AND</MenuItem>
                <MenuItem value="OR">OR</MenuItem>
                <MenuItem value="NOT">NOT</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {group.conditions.map((condition, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
                mb: 1,
                p: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
              }}
            >
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Field</InputLabel>
                <Select
                  value={condition.field}
                  onChange={(e) =>
                    updateCondition(group.id, index, 'field', e.target.value)
                  }
                  label="Field"
                >
                  {FIELDS.map((field) => (
                    <MenuItem key={field.value} value={field.value}>
                      {field.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={condition.condition}
                  onChange={(e) =>
                    updateCondition(group.id, index, 'condition', e.target.value)
                  }
                  label="Condition"
                >
                  {CONDITIONS.map((cond) => (
                    <MenuItem key={cond.value} value={cond.value}>
                      {cond.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {condition.condition !== 'isEmpty' && condition.condition !== 'isNotEmpty' && (
                <TextField
                  size="small"
                  placeholder="Value"
                  value={condition.value || ''}
                  onChange={(e) =>
                    updateCondition(group.id, index, 'value', e.target.value)
                  }
                  sx={{ flex: 1, minWidth: 120 }}
                />
              )}

              <IconButton
                size="small"
                onClick={() => removeCondition(group.id, index)}
                disabled={group.conditions.length === 1}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              {index < group.conditions.length - 1 && (
                <Chip
                  label={group.logic}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          ))}

          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => addCondition(group.id)}
          >
            Add Condition
          </Button>
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 2 }}>
        <Box>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addGroup}>
            Add Group
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="error" onClick={resetFilters}>
            Reset
          </Button>
          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchFilterBuilder;