/**
 * Examination Selector Component
 * Allows selection of an examination for candidate import
 */

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Stack,
  Typography,
  Skeleton,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

const ExaminationSelector = ({
  examinations,
  selectedExamination,
  onChange,
  loading,
  error,
}) => {
  const handleChange = (event) => {
    const examId = event.target.value;
    const exam = examinations.find((e) => e._id === examId);
    onChange(exam);
  };

  if (loading) {
    return (
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" height={40} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth error={!!error}>
        <InputLabel id="examination-select-label">
          Select Examination *
        </InputLabel>
        <Select
          labelId="examination-select-label"
          value={selectedExamination?._id || ''}
          onChange={handleChange}
          label="Select Examination *"
          renderValue={(selected) => {
            const exam = examinations.find((e) => e._id === selected);
            if (!exam) return 'Select Examination';
            return (
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon fontSize="small" color="primary" />
                <Typography variant="body2">{exam.code}</Typography>
                <Chip
                  label={exam.status}
                  size="small"
                  color={exam.status === 'Active' ? 'success' : 'default'}
                  variant="outlined"
                />
                <Typography variant="caption" color="textSecondary">
                  {exam.promotionYear}
                </Typography>
              </Stack>
            );
          }}
        >
          {examinations.map((exam) => (
            <MenuItem key={exam._id} value={exam._id}>
              <Stack direction="column" spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={500}>
                    {exam.name}
                  </Typography>
                  <Chip
                    label={exam.status}
                    size="small"
                    color={exam.status === 'Active' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="caption" color="textSecondary">
                    Code: {exam.code}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Year: {exam.promotionYear}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Type: {exam.examinationType}
                  </Typography>
                </Stack>
              </Stack>
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText error>{error}</FormHelperText>}
        {!error && selectedExamination && (
          <FormHelperText>
            Importing candidates into {selectedExamination.name}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default ExaminationSelector;