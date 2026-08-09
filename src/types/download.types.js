/**
 * Package Download Type Definitions
 * Based on backend Package Download Service
 */

// Download status enum
export const DownloadStatus = {
  STARTED: 'STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

// Download status labels
export const DownloadStatusLabels = {
  STARTED: 'Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

// Download status colors
export const DownloadStatusColors = {
  STARTED: '#2196f3',
  IN_PROGRESS: '#ff9800',
  COMPLETED: '#4caf50',
  FAILED: '#f44336',
  CANCELLED: '#9e9e9e',
};

// Download record
export const DownloadShape = {
  _id: '',
  packageId: '',
  distributionId: '',
  centreId: '',
  downloadedBy: '',
  downloadStatus: '',
  ipAddress: '',
  userAgent: '',
  fileSize: 0,
  downloadDuration: 0,
  downloadSpeed: 0,
  metadata: {
    bytesDownloaded: 0,
    progressPercentage: 0,
    checksumVerified: false,
  },
  timeline: {
    startedAt: '',
    completedAt: '',
  },
  retry: {
    attemptNumber: 0,
    maxRetries: 5,
  },
  errorDetails: {
    code: '',
    message: '',
    stack: '',
  },
  createdAt: '',
  updatedAt: '',
};

// Download initiation response
export const DownloadInitiationResponse = {
  downloadId: '',
  packageId: '',
  fileName: '',
  fileSize: 0,
  downloadToken: '',
  tokenExpiresAt: '',
  downloadStatus: '',
  startedAt: '',
};

// Download URL response
export const DownloadUrlResponse = {
  url: '',
  expiresIn: 0,
  expiresAt: '',
  method: 'GET',
};

// Download progress
export const DownloadProgress = {
  downloadId: '',
  packageId: '',
  progressPercentage: 0,
  bytesDownloaded: 0,
  totalBytes: 0,
  speed: 0,
  estimatedTimeRemaining: 0,
  status: '',
};