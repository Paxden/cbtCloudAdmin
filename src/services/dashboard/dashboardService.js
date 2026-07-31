/* eslint-disable no-useless-assignment */
/* eslint-disable no-unused-vars */
/**
 * Dashboard Service
 * API communication for dashboard data
 * Currently using mock data until backend endpoints are ready
 */

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_STATS = {
  success: true,
  data: {
    totalQuestions: 15420,
    publishedQuestions: 8230,
    pendingReviews: 247,
    draftQuestions: 3400,
    categories: 12,
    subjects: 48,
    byStatus: {
      DRAFT: 3400,
      PENDING_REVIEW: 247,
      APPROVED: 2543,
      PUBLISHED: 8230,
      REJECTED: 580,
      ARCHIVED: 420,
    },
  },
};

const MOCK_RECENT_ACTIVITIES = {
  success: true,
  data: [
    {
      id: '1',
      action: 'QUESTION_CREATED',
      description: 'Created question "What is the capital of Nigeria?"',
      user: { name: 'John Doe' },
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: '2',
      action: 'QUESTION_APPROVED',
      description: 'Approved 5 questions for Professional Knowledge subject',
      user: { name: 'Jane Smith' },
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '3',
      action: 'MEDIA_UPLOADED',
      description: 'Uploaded 3 images to Media Library',
      user: { name: 'Alice Johnson' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '4',
      action: 'QUESTION_PUBLISHED',
      description: 'Published 20 questions for Promotion Examination',
      user: { name: 'Bob Wilson' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '5',
      action: 'QUESTION_UPDATED',
      description: 'Updated question "What is the largest country in Africa?"',
      user: { name: 'John Doe' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: '6',
      action: 'BULK_IMPORT',
      description: 'Imported 150 questions from Excel file',
      user: { name: 'Sarah Johnson' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: '7',
      action: 'QUESTION_REJECTED',
      description: 'Rejected question "What is the fastest animal?"',
      user: { name: 'Mike Brown' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
  ],
};

const MOCK_PENDING_REVIEWS = {
  success: true,
  data: [
    {
      _id: '1',
      question: { questionCode: 'QST-001234', _id: 'q1' },
      subject: { name: 'Professional Knowledge' },
      author: { name: 'John Doe' },
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      _id: '2',
      question: { questionCode: 'QST-001235', _id: 'q2' },
      subject: { name: 'Ethics' },
      author: { name: 'Jane Smith' },
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      _id: '3',
      question: { questionCode: 'QST-001236', _id: 'q3' },
      subject: { name: 'Administration' },
      author: { name: 'Alice Johnson' },
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      _id: '4',
      question: { questionCode: 'QST-001237', _id: 'q4' },
      subject: { name: 'Laws' },
      author: { name: 'Bob Wilson' },
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      _id: '5',
      question: { questionCode: 'QST-001238', _id: 'q5' },
      subject: { name: 'General Knowledge' },
      author: { name: 'Jane Smith' },
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ],
};

const MOCK_IMPORTS = {
  success: true,
  data: [
    {
      _id: '1',
      fileName: 'questions-batch-2026-01.xlsx',
      fileType: 'xlsx',
      importedRecords: 150,
      status: 'COMPLETED',
      uploadedBy: { name: 'John Doe' },
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      _id: '2',
      fileName: 'promotion-questions.json',
      fileType: 'json',
      importedRecords: 45,
      status: 'PARTIAL',
      uploadedBy: { name: 'Jane Smith' },
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      _id: '3',
      fileName: 'recruitment-exam.csv',
      fileType: 'csv',
      importedRecords: 200,
      status: 'COMPLETED',
      uploadedBy: { name: 'Alice Johnson' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  ],
};

const MOCK_DISTRIBUTION_BY_CATEGORY = {
  success: true,
  data: [
    { name: 'Promotion Examination', count: 5000 },
    { name: 'Recruitment Examination', count: 2500 },
    { name: 'Certification Examination', count: 1800 },
    { name: 'Mock Examination', count: 1200 },
    { name: 'Professional Development', count: 800 },
  ],
};

const MOCK_DISTRIBUTION_BY_SUBJECT = {
  success: true,
  data: [
    { name: 'Professional Knowledge', count: 3000 },
    { name: 'Ethics', count: 1200 },
    { name: 'Administration', count: 800 },
    { name: 'Laws', count: 600 },
    { name: 'General Knowledge', count: 400 },
  ],
};

const MOCK_DISTRIBUTION_BY_DIFFICULTY = {
  success: true,
  data: [
    { name: 'Easy', count: 3000 },
    { name: 'Medium', count: 2500 },
    { name: 'Hard', count: 1000 },
    { name: 'Expert', count: 200 },
  ],
};

const MOCK_DISTRIBUTION_BY_TYPE = {
  success: true,
  data: [
    { name: 'Single Choice', count: 6000 },
    { name: 'Multiple Choice', count: 2000 },
    { name: 'True/False', count: 500 },
    { name: 'Fill in the Blank', count: 300 },
  ],
};

const MOCK_SYSTEM_STATUS = {
  success: true,
  data: {
    api: { status: 'healthy', uptime: '99.9%' },
    database: { status: 'healthy', connected: true },
    storage: { status: 'healthy', used: '45%' },
    backgroundJobs: { status: 'running', pending: 0 },
    packageGenerator: { status: 'idle', lastRun: '2 hours ago' },
    sync: { status: 'synced', lastSync: '1 hour ago' },
  },
};

// ============================================================
// SERVICE FUNCTIONS (Using Mock Data)
// ============================================================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_STATS;
};

/**
 * Get question overview statistics
 */
export const getQuestionOverview = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return { success: true, data: MOCK_STATS.data };
};

/**
 * Get recent activities
 */
export const getRecentActivities = async (params = { limit: 10 }) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const limited = MOCK_RECENT_ACTIVITIES.data.slice(0, params.limit);
  return { success: true, data: limited };
};

/**
 * Get pending reviews
 */
export const getPendingReviews = async (params = { limit: 5 }) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const limited = MOCK_PENDING_REVIEWS.data.slice(0, params.limit);
  return { success: true, data: limited };
};

/**
 * Get recent imports
 */
export const getRecentImports = async (params = { limit: 5 }) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const limited = MOCK_IMPORTS.data.slice(0, params.limit);
  return { success: true, data: limited };
};

/**
 * Get system status
 */
export const getSystemStatus = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_SYSTEM_STATUS;
};

/**
 * Get question distribution data
 */
export const getQuestionDistribution = async (params = { groupBy: 'category' }) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  let data = [];
  switch (params.groupBy) {
    case 'subject':
      data = MOCK_DISTRIBUTION_BY_SUBJECT.data;
      break;
    case 'difficulty':
      data = MOCK_DISTRIBUTION_BY_DIFFICULTY.data;
      break;
    case 'type':
      data = MOCK_DISTRIBUTION_BY_TYPE.data;
      break;
    case 'category':
    default:
      data = MOCK_DISTRIBUTION_BY_CATEGORY.data;
      break;
  }
  
  return { success: true, data };
};

/**
 * Get question status chart data
 */
export const getQuestionStatusChart = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return { success: true, data: MOCK_STATS.data };
};