/**
 * Package Distribution Type Definitions
 * Based on backend Package Distribution Service
 */

// Distribution status enum
export const DistributionStatus = {
  AVAILABLE: 'AVAILABLE',
  DOWNLOADED: 'DOWNLOADED',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
  FAILED: 'FAILED',
};

// Distribution status labels
export const DistributionStatusLabels = {
  AVAILABLE: 'Available',
  DOWNLOADED: 'Downloaded',
  EXPIRED: 'Expired',
  REVOKED: 'Revoked',
  FAILED: 'Failed',
};

// Distribution status colors
export const DistributionStatusColors = {
  AVAILABLE: '#4caf50',
  DOWNLOADED: '#2196f3',
  EXPIRED: '#ff9800',
  REVOKED: '#f44336',
  FAILED: '#e91e63',
};

// Distribution record
export const DistributionShape = {
  _id: '',
  packageId: '',
  packageFileId: '',
  examId: '',
  instanceId: '',
  centreId: '',
  centreCode: '',
  status: '',
  fileName: '',
  fileSize: 0,
  downloadToken: '',
  tokenExpiresAt: '',
  expiresAt: '',
  downloadCount: 0,
  maxDownloadAttempts: 5,
  lastDownloadAt: null,
  lastDownloadedBy: null,
  audit: {
    assignedBy: '',
    assignedAt: '',
    lastModifiedBy: '',
    lastModifiedAt: '',
    ipAddress: '',
    userAgent: '',
  },
  metadata: {
    assignedAt: '',
    readyForDownloadAt: '',
    downloadedAt: '',
  },
  isDeleted: false,
  deletedAt: null,
  deletedBy: null,
  createdAt: '',
  updatedAt: '',
};

// Create distribution request
export const CreateDistributionRequest = {
  packageId: '',
  centreId: '',
  expiryDays: 30,
};

// Distribution list response
export const DistributionListResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

// Authorization result
export const AuthorizationResult = {
  authorized: false,
  distribution: null,
  packageId: '',
  centreId: '',
  userId: '',
};