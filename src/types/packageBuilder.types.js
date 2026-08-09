/**
 * Package Builder Type Definitions
 * Based on backend CBTX Builder service
 */

// File status enum
export const FileStatus = {
  PENDING: 'PENDING',
  BUILDING: 'BUILDING',
  CREATED: 'CREATED',
  FAILED: 'FAILED',
  CORRUPTED: 'CORRUPTED',
  DELETED: 'DELETED',
};

// File status labels
export const FileStatusLabels = {
  PENDING: 'Pending',
  BUILDING: 'Building',
  CREATED: 'Created',
  FAILED: 'Failed',
  CORRUPTED: 'Corrupted',
  DELETED: 'Deleted',
};

// File status colors
export const FileStatusColors = {
  PENDING: '#9e9e9e',
  BUILDING: '#ff9800',
  CREATED: '#4caf50',
  FAILED: '#f44336',
  CORRUPTED: '#e91e63',
  DELETED: '#757575',
};

// Package file record
export const PackageFileShape = {
  _id: '',
  packageId: '',
  checksumId: '',
  signatureId: '',
  encryptionId: '',
  fileName: '',
  fileExtension: '.cbtx',
  filePath: '',
  fileSize: 0,
  fileSizeFormatted: '0 B',
  compressionFormat: 'ZIP',
  compressionLevel: 6,
  manifestVersion: '1.0.0',
  status: '',
  internalFiles: [],
  generation: {
    startedAt: null,
    completedAt: null,
    durationMs: 0,
    version: '1.0.0',
  },
  structure: {
    validated: false,
    errors: [],
    warnings: [],
    fileCount: 0,
  },
  errorDetails: {
    code: '',
    message: '',
    stack: '',
    timestamp: null,
  },
  isDeleted: false,
  deletedAt: null,
  deletedBy: null,
  audit: {
    createdBy: '',
    createdAt: '',
    lastModifiedBy: '',
    lastModifiedAt: '',
    ipAddress: '',
    userAgent: '',
  },
  createdAt: '',
  updatedAt: '',
};

// Build request
export const BuildRequest = {
  packageId: '',
};

// Build result
export const BuildResult = {
  _id: '',
  packageId: '',
  fileName: '',
  fileSize: 0,
  fileSizeFormatted: '',
  status: '',
  generation: {
    startedAt: '',
    completedAt: '',
    durationMs: 0,
  },
  structure: {
    validated: true,
    errors: [],
    warnings: [],
    fileCount: 0,
  },
};

// Package data for build
export const PackageBuildData = {
  _id: '',
  packageCode: '',
  examCode: '',
  examId: '',
  centreCode: '',
  centreId: '',
  status: '',
  packageVersion: 1,
  candidates: [],
  papers: [],
  configuration: {},
  blueprint: {},
  rules: {},
  instructions: {},
  schedule: {},
};

// Encryption record
export const EncryptionRecord = {
  _id: '',
  packageId: '',
  algorithm: 'AES-256-GCM',
  keyId: '',
  iv: '',
  tag: '',
  status: '',
  createdAt: '',
};

// Signature record
export const SignatureRecord = {
  _id: '',
  packageId: '',
  algorithm: 'RSA-SHA256',
  publicKeyId: '',
  signature: '',
  status: '',
  verified: false,
  createdAt: '',
};

// Checksum record
export const ChecksumRecord = {
  _id: '',
  packageId: '',
  algorithm: 'SHA-256',
  hash: '',
  status: '',
  verified: false,
  createdAt: '',
};