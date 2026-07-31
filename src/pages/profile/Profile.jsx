/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Profile Page
 * User profile management
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import ProfileCard from "../../components/profile/ProfileCard";
import ProfileForm from "../../components/profile/ProfileForm";
import AccountInformation from "../../components/profile/AccountInformation";
import PasswordChangeForm from "../../components/profile/PasswordChangeForm";
import ActivityTable from "../../components/profile/ActivityTable";
import {
  getProfile,
  getActivityLog,
} from "../../services/profile/profileService";

const Profile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityPage, setActivityPage] = useState(0);
  const [activityLimit, setActivityLimit] = useState(20);
  const [activityTotal, setActivityTotal] = useState(0);

  // ✅ Use ref to prevent multiple fetches
  const hasFetched = useRef(false);

  const fetchProfile = useCallback(async () => {
    // ✅ Prevent multiple simultaneous fetches
    if (hasFetched.current && !refreshing) return;

    try {
      setError(null);
      const response = await getProfile();
      if (response.success) {
        setProfile(response.data);
        hasFetched.current = true;
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await getActivityLog({
        page: activityPage + 1,
        limit: activityLimit,
      });
      if (response.success) {
        setActivities(response.data || []);
        setActivityTotal(response.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    }
  }, [activityPage, activityLimit]);

  // ✅ Initial load - only once
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array

  // ✅ Fetch activities when tab changes to activity tab
  useEffect(() => {
    if (tab === 2) {
      fetchActivities();
    }
  }, [tab, fetchActivities]);

  const handleRefresh = () => {
    hasFetched.current = false;
    setRefreshing(true);
    fetchProfile();
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleActivityPageChange = (newPage) => {
    setActivityPage(newPage);
  };

  const handleActivityLimitChange = (newLimit) => {
    setActivityLimit(newLimit);
    setActivityPage(0);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Profile"
        subtitle="Manage your account settings and preferences"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button size="small" onClick={handleRefresh}>
            Retry
          </Button>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Profile Card */}
        <Grid item xs={12} md={4}>
          <ProfileCard
            profile={profile}
            loading={refreshing}
            onUpdate={fetchProfile}
          />
        </Grid>

        {/* Right Column - Tabs */}
        <Grid item xs={12} md={8}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Edit Profile" />
              <Tab label="Account Info" />
              <Tab label="Activity Log" />
              <Tab label="Security" />
            </Tabs>
          </Box>

          {/* Edit Profile */}
          {tab === 0 && (
            <ProfileForm
              profile={profile}
              loading={refreshing}
              onUpdate={fetchProfile}
            />
          )}

          {/* Account Information */}
          {tab === 1 && (
            <AccountInformation profile={profile} loading={refreshing} />
          )}

          {/* Activity Log */}
          {tab === 2 && (
            <ActivityTable
              activities={activities}
              loading={loading}
              page={activityPage}
              limit={activityLimit}
              total={activityTotal}
              onPageChange={handleActivityPageChange}
              onLimitChange={handleActivityLimitChange}
            />
          )}

          {/* Security - Password Change */}
          {tab === 3 && <PasswordChangeForm />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
