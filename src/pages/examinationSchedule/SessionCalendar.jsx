/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Session Calendar Page
 * Calendar view of examination sessions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  Stack,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Drawer,
  Divider,
  Card,
  CardContent,
  Badge,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  ViewWeek as WeekIcon,
  ViewDay as DayIcon,
  ViewModule as MonthIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, eachWeekOfInterval, isWithinInterval } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import SessionStatusChip from '../../components/examinationSchedule/SessionStatusChip';
import * as scheduleService from '../../services/examinationSchedule/examinationScheduleService';
import * as examinationService from '../../services/examination/examinationService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const VIEWS = [
  { id: 'month', label: 'Month', icon: MonthIcon },
  { id: 'week', label: 'Week', icon: WeekIcon },
  { id: 'day', label: 'Day', icon: DayIcon },
];

const SessionCalendar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get('examinationId') || '';

  const canView = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedSession, setSelectedSession] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Load examinations
  const loadExaminations = useCallback(async () => {
    setExaminationsLoading(true);
    try {
      const response = await examinationService.getExaminations({ limit: 100 });
      let examList = [];
      if (response.success) {
        examList = response.data || [];
      } else if (Array.isArray(response)) {
        examList = response;
      } else if (response.data && Array.isArray(response.data)) {
        examList = response.data;
      }
      setExaminations(examList);
    } catch (err) {
      console.error('Failed to load examinations:', err);
    } finally {
      setExaminationsLoading(false);
    }
  }, []);

  // Load sessions for calendar
  const loadSessions = useCallback(async () => {
    if (!selectedExaminationId) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        view,
        date: format(currentDate, 'yyyy-MM-dd'),
      };
      const response = await scheduleService.getCalendar(selectedExaminationId, params);
      console.log('📋 Calendar response:', response);

      if (response && response.success) {
        setSessions(response.data || []);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('❌ Failed to load calendar:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId, view, currentDate]);

  // Initial load
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadSessions();
    }
  }, [selectedExaminationId, loadSessions]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setSessions([]);
  };

  // Navigation handlers
  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedSession(null);
  };

  // Get sessions for a specific date
  const getSessionsForDate = (date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      return isSameDay(sessionDate, date);
    });
  };

  // Get color for session status
  const getSessionColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return '#4caf50';
      case 'RUNNING': return '#2196f3';
      case 'COMPLETED': return '#9e9e9e';
      case 'CANCELLED': return '#f44336';
      case 'CONFLICT': return '#ff9800';
      default: return '#e0e0e0';
    }
  };

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);

  // Render calendar days
  const renderCalendarDays = () => {
    if (view === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const days = eachDayOfInterval({ start, end });
      
      // Get day of week for first day (0 = Sunday)
      const firstDayOfWeek = start.getDay();
      
      // Create empty slots for days before first day of month
      const emptySlots = Array(firstDayOfWeek).fill(null);
      
      const allDays = [...emptySlots, ...days];
      
      // Split into weeks
      const weeks = [];
      let week = [];
      for (let i = 0; i < allDays.length; i++) {
        week.push(allDays[i]);
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }
      if (week.length > 0) {
        while (week.length < 7) {
          week.push(null);
        }
        weeks.push(week);
      }

      return (
        <Box>
          {/* Day Headers */}
          <Grid container columns={7} sx={{ mb: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs={1} key={day}>
                <Typography variant="caption" fontWeight={600} align="center" display="block">
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Grid */}
          {weeks.map((week, weekIndex) => (
            <Grid container columns={7} key={weekIndex} sx={{ mb: 0.5 }}>
              {week.map((day, dayIndex) => {
                if (!day) {
                  return (
                    <Grid item xs={1} key={dayIndex}>
                      <Paper
                        sx={{
                          height: 80,
                          bgcolor: 'action.hover',
                          opacity: 0.3,
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                  );
                }

                const daySessions = getSessionsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);

                return (
                  <Grid item xs={1} key={dayIndex}>
                    <Paper
                      sx={{
                        height: 80,
                        p: 0.5,
                        bgcolor: isCurrentDay ? 'primary.lighter' : isCurrentMonth ? 'background.paper' : 'action.hover',
                        border: isCurrentDay ? '2px solid' : '1px solid',
                        borderColor: isCurrentDay ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        overflow: 'hidden',
                      }}
                      onClick={() => {
                        if (daySessions.length > 0) {
                          handleSessionClick(daySessions[0]);
                        }
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={isCurrentDay ? 700 : 400}
                        color={isCurrentMonth ? 'text.primary' : 'text.disabled'}
                      >
                        {format(day, 'd')}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {daySessions.slice(0, 2).map((session, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              height: 4,
                              bgcolor: getSessionColor(session.status),
                              borderRadius: 2,
                              mb: 0.5,
                              width: '100%',
                            }}
                          />
                        ))}
                        {daySessions.length > 2 && (
                          <Typography variant="caption" color="textSecondary">
                            +{daySessions.length - 2}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Box>
      );
    } else if (view === 'week') {
      // Week view
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      const days = eachDayOfInterval({ start, end });

      return (
        <Box>
          {/* Day Headers */}
          <Grid container columns={7} sx={{ mb: 1 }}>
            {days.map((day) => (
              <Grid item xs={1} key={day.toString()}>
                <Typography
                  variant="caption"
                  fontWeight={isToday(day) ? 700 : 400}
                  color={isToday(day) ? 'primary.main' : 'text.primary'}
                  align="center"
                  display="block"
                >
                  {format(day, 'EEE d')}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Grid container columns={7}>
            {days.map((day) => {
              const daySessions = getSessionsForDate(day);
              return (
                <Grid item xs={1} key={day.toString()}>
                  <Paper
                    sx={{
                      minHeight: 400,
                      p: 0.5,
                      bgcolor: isToday(day) ? 'primary.lighter' : 'background.paper',
                      border: isToday(day) ? '2px solid' : '1px solid',
                      borderColor: isToday(day) ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => {
                      if (daySessions.length > 0) {
                        handleSessionClick(daySessions[0]);
                      }
                    }}
                  >
                    {daySessions.map((session, idx) => (
                      <Paper
                        key={idx}
                        sx={{
                          p: 0.5,
                          mb: 0.5,
                          bgcolor: `${getSessionColor(session.status)}20`,
                          borderLeft: `3px solid ${getSessionColor(session.status)}`,
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: `${getSessionColor(session.status)}40`,
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSessionClick(session);
                        }}
                      >
                        <Typography variant="caption" display="block" fontWeight={500} noWrap>
                          {session.sessionName || session.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {session.startTime} - {session.endTime}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block" noWrap>
                          {session.centreId?.name || 'N/A'}
                        </Typography>
                      </Paper>
                    ))}
                    {daySessions.length === 0 && (
                      <Typography variant="caption" color="textSecondary">
                        No sessions
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      );
    } else {
      // Day view
      const daySessions = getSessionsForDate(currentDate);

      return (
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </Typography>

          {daySessions.length > 0 ? (
            <Stack spacing={2}>
              {daySessions.map((session, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    p: 2,
                    borderLeft: `4px solid ${getSessionColor(session.status)}`,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => handleSessionClick(session)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {session.sessionName || session.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {session.centreId?.name || 'N/A'} • {session.startTime} - {session.endTime}
                      </Typography>
                    </Box>
                    <SessionStatusChip status={session.status} />
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${session.registeredCount || 0}/${session.capacity || 0}`}
                      size="small"
                      variant="outlined"
                    />
                    {session.duration && (
                      <Chip
                        icon={<ScheduleIcon />}
                        label={`${session.duration} min`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="textSecondary">No sessions scheduled for this day</Typography>
            </Paper>
          )}
        </Box>
      );
    }
  };

  // Check permissions
  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to view the calendar.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/examinations')}
          sx={{ mt: 2 }}
        >
          Back to Examinations
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Session Calendar"
        subtitle="View examination sessions in calendar format"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadSessions}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => navigate('/examination-schedule')}
            >
              Back
            </Button>
          </Stack>
        }
      />

      {/* Examination Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Examination</InputLabel>
              <Select
                value={selectedExaminationId}
                onChange={(e) => handleExaminationChange(e.target.value)}
                label="Select Examination"
                disabled={examinationsLoading}
              >
                <MenuItem value="">
                  <em>Select an examination</em>
                </MenuItem>
                {examinations.map((exam) => (
                  <MenuItem key={exam._id} value={exam._id}>
                    {exam.name} ({exam.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedExaminationId && selectedExam && (
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Chip label={selectedExam.name} color="primary" />
                <Chip label={selectedExam.code} variant="outlined" size="small" />
                <Chip label={selectedExam.status} variant="outlined" size="small" />
                <Chip
                  label={`${sessions.length} sessions`}
                  color="info"
                  variant="outlined"
                  size="small"
                />
                {examinationsLoading && <CircularProgress size={24} />}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>

      {selectedExaminationId ? (
        <>
          {/* Calendar Controls */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Stack direction="row" spacing={1}>
                <IconButton onClick={handlePrev}>
                  <PrevIcon />
                </IconButton>
                <IconButton onClick={handleToday}>
                  <TodayIcon />
                </IconButton>
                <IconButton onClick={handleNext}>
                  <NextIcon />
                </IconButton>
              </Stack>

              <Typography variant="h6" fontWeight={500} sx={{ minWidth: 150 }}>
                {view === 'month' && format(currentDate, 'MMMM yyyy')}
                {view === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM d')}`}
                {view === 'day' && format(currentDate, 'MMMM d, yyyy')}
              </Typography>

              <Box sx={{ flex: 1 }} />

              <Stack direction="row" spacing={1}>
                {VIEWS.map((v) => (
                  <Button
                    key={v.id}
                    variant={view === v.id ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<v.icon />}
                    onClick={() => handleViewChange(v.id)}
                  >
                    {v.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Paper>

          {/* Calendar Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper sx={{ p: 2 }}>
              {renderCalendarDays()}
            </Paper>
          )}

          {/* Session Details Drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleCloseDrawer}
            PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
          >
            <Box sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Session Details
                </Typography>
                <IconButton onClick={handleCloseDrawer}>
                  <CloseIcon />
                </IconButton>
              </Stack>

              {selectedSession && (
                <>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Session Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedSession.sessionName || selectedSession.name}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Status
                      </Typography>
                      <SessionStatusChip status={selectedSession.status} />
                    </Box>

                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Centre
                      </Typography>
                      <Typography variant="body1">
                        {selectedSession.centreId?.name || 'N/A'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1">
                        {selectedSession.sessionDate ? format(new Date(selectedSession.sessionDate), 'dd/MM/yyyy') : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedSession.startTime} - {selectedSession.endTime}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Duration
                      </Typography>
                      <Typography variant="body1">
                        {selectedSession.duration || 'N/A'} minutes
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Candidates
                      </Typography>
                      <Typography variant="body1">
                        {selectedSession.registeredCount || 0} / {selectedSession.capacity || 0}
                      </Typography>
                    </Box>

                    {selectedSession.notes && (
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          Notes
                        </Typography>
                        <Typography variant="body2">
                          {selectedSession.notes}
                        </Typography>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Created
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedSession.createdAt ? format(new Date(selectedSession.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        handleCloseDrawer();
                        navigate(`/examination-schedule?examinationId=${selectedExaminationId}`);
                      }}
                    >
                      View All Sessions
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          </Drawer>
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to view its calendar.
          </Typography>
        </Box>
      )}

      {/* Toast */}
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

export default SessionCalendar;