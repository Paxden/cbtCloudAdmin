/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Examination Form Page
 * Create or edit an examination
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import AppPageHeader from '../../components/common/AppPageHeader';
import ExaminationForm from '../../components/examinations/ExaminationForm';
import * as examinationService from '../../services/examination/examinationService';

const ExaminationFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const isClone = window.location.pathname.includes('/clone');

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(isEdit || isClone);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Fetch examination data for edit or clone
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await examinationService.getExamination(id);
          if (response.success) {
            const data = response.data;
            if (isClone) {
              // For clone, prepare data with new code
              setInitialData({
                ...data,
                code: `${data.code}_CLONE_${Date.now().toString().slice(-4)}`,
                name: `${data.name} (Clone)`,
              });
            } else {
              setInitialData(data);
            }
          }
        } catch (err) {
          setError(err.message || 'Failed to load examination');
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    } else {
      setFetching(false);
    }
  }, [id, isClone]);

  // Handle form submission
  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await examinationService.updateExamination(id, data);
        setToast({
          open: true,
          message: 'Examination updated successfully',
          severity: 'success',
        });
        setTimeout(() => navigate('/examinations'), 1000);
      } else if (isClone) {
        await examinationService.cloneExamination(id, data);
        setToast({
          open: true,
          message: 'Examination cloned successfully',
          severity: 'success',
        });
        setTimeout(() => navigate('/examinations'), 1000);
      } else {
        await examinationService.createExamination(data);
        setToast({
          open: true,
          message: 'Examination created successfully',
          severity: 'success',
        });
        setTimeout(() => navigate('/examinations'), 1000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save examination');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/examinations');
  };

  // Check code availability
  const handleCheckCodeAvailability = async (code) => {
    try {
      const response = await examinationService.checkCodeAvailability(code);
      return response.data;
    } catch (err) {
      return { isAvailable: false };
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title={isEdit ? 'Edit Examination' : isClone ? 'Clone Examination' : 'Create Examination'}
        subtitle={
          isEdit ? 'Update examination details' :
          isClone ? 'Create a copy of an existing examination' :
          'Create a new examination for the CBT platform'
        }
        actions={
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleCancel}
          >
            Back
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ExaminationForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error}
        isEdit={isEdit}
        checkCodeAvailability={handleCheckCodeAvailability}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExaminationFormPage;