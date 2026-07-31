/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Centre Form Page
 * Create or edit a centre
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
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import CentreForm from '../../components/centres/CentreForm';
import * as centreService from '../../services/centres/centreService';
import * as userService from '../../services/user/userService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const CentreFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canEdit = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(isEdit);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Check permissions
  if (!canEdit) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to create or edit centres.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/centres')}
          sx={{ mt: 2 }}
        >
          Back to Centres
        </Button>
      </Box>
    );
  }

  // Fetch centre data for edit
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await centreService.getCentre(id);
          if (response.success) {
            setInitialData(response.data);
          } else {
            setError('Centre not found');
          }
        } catch (err) {
          setError(err.message || 'Failed to load centre');
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    } else {
      setFetching(false);
    }
  }, [id]);

  // Fetch users for manager assignment (CENTRE_MANAGER role)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        // Try to fetch users with CENTRE_MANAGER role
        const response = await userService.getUsers({ 
          limit: 100, 
          role: 'CENTRE_MANAGER',
          status: 'ACTIVE'
        });
        console.log('📋 Users response:', response);
        
        if (response.success) {
          setUsers(response.data || []);
        } else if (Array.isArray(response)) {
          setUsers(response);
        } else if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          // Fallback: fetch all active users and filter
          const allUsersResponse = await userService.getUsers({ 
            limit: 100, 
            status: 'ACTIVE' 
          });
          if (allUsersResponse.success) {
            // Filter users with CENTRE_MANAGER role
            const allUsers = allUsersResponse.data || [];
            const filtered = allUsers.filter(u => 
              u.role?.name === 'CENTRE_MANAGER' || 
              u.role === 'CENTRE_MANAGER'
            );
            setUsers(filtered);
          } else {
            setUsers([]);
          }
        }
      } catch (err) {
        console.error('❌ Failed to load users:', err);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure manager is null if empty string
      if (data.manager === '') {
        data.manager = null;
      }

      if (isEdit) {
        await centreService.updateCentre(id, data);
        setToast({
          open: true,
          message: 'Centre updated successfully',
          severity: 'success',
        });
      } else {
        await centreService.createCentre(data);
        setToast({
          open: true,
          message: 'Centre created successfully',
          severity: 'success',
        });
      }
      setTimeout(() => navigate('/centres'), 1500);
    } catch (err) {
      const errorMessage = err.message || err.msg || 'Failed to save centre';
      setError(errorMessage);
      setToast({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/centres');
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
        title={isEdit ? 'Edit Centre' : 'Create Centre'}
        subtitle={isEdit ? 'Update centre details' : 'Create a new examination centre'}
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

      <CentreForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error}
        isEdit={isEdit}
        users={users}
        loadingUsers={loadingUsers}
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

export default CentreFormPage;