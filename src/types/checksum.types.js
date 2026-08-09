/**
 * Package Checksum Type Definitions
 * Based on backend Package Checksum Service
 */

// Checksum status enum
export const ChecksumStatus = {
  PENDING: 'PENDING',
  GENERATING: 'GENERATING',
  GENERATED: 'GENERATED',
  VERIFIED: 'VERIFIED',
  FAILED: 'FAILED',
  CORRUPTED: 'CORRUPTED',
};

// Checksum status labels
export const ChecksumStatusLabels = {
  PENDING: 'Pending',
  GENERATING: 'Generating',
  GENERATED: 'Generated',
  VERIFIED: 'Verified',
  FAILED: 'Failed',
  CORRUPTED: 'Corrupted',
};

// Checksum status colors
export const ChecksumStatusColors = {
  PENDING: '#9e9e9e',
  GENERATING: '#ff9800',
  GENERATED: '#2196f3',
  VERIFIED: '#4caf50',
  FAILED: '#f44336',
  CORRUPTED: '#e91e63',
};

// File types
export const FileTypes = {
  ENCRYPTED_QUESTIONS: 'ENCRYPTED_QUESTIONS',
  ENCRYPTED_CANDIDATES: 'ENCRYPTED_CANDIDATES',
  ENCRYPTED_CONFIGURATION: 'ENCRYPTED_CONFIGURATION',
  ENCRYPTED_INSTRUCTIONS: 'ENCRYPTED_INSTRUCTIONS',
  SIGNATURE_FILE: 'SIGNATURE_FILE',
  ENCRYPTION_METADATA: 'ENCRYPTION_METADATA',
  BLUEPRINT: 'BLUEPRINT',
  RULES: 'RULES',
  SCHEDULE: 'SCHEDULE',
};

// File type labels
export const FileTypeLabels = {
  ENCRYPTED_QUESTIONS: 'Encrypted Questions',
  ENCRYPTED_CANDIDATES: 'Encrypted Candidates',
  ENCRYPTED_CONFIGURATION: 'Encrypted Configuration',
  ENCRYPTED_INSTRUCTIONS: 'Encrypted Instructions',
  SIGNATURE_FILE: 'Signature File',
  ENCRYPTION_METADATA: 'Encryption Metadata',
  BLUEPRINT: 'Blueprint',
  RULES: 'Rules',
  SCHEDULE: 'Schedule',
};

// Checksum record
export const ChecksumRecordShape = {
  _id: '',
  packageId: '',
  signatureId: '',
  encryptionId: '',
  checksumVersion: '1.0.0',
  algorithm: 'SHA-256',
  status: '',
  checksum: '',
  fingerprint: '',
  shortFingerprint: '',
  fileHashes: {},
  combinedHash: '',
  packageSize: 0,
  fileCount: 0,
  verification: {
    verified: false,
    verifiedBy: '',
    verifiedAt: '',
    result: '',
    details: '',
    failedFiles: [],
  },
  metadata: {
    generationTime: 0,
  },
  errorDetails: {
    code: '',
    message: '',
    stack: '',
    timestamp: null,
  },
  audit: {
    generatedBy: '',
    generatedAt: '',
    lastModifiedBy: '',
    lastModifiedAt: '',
    ipAddress: '',
    userAgent: '',
  },
  createdAt: '',
  updatedAt: '',
};

// Checksum status response
export const ChecksumStatusResponse = {
  packageId: '',
  status: '',
  algorithm: '',
  checksumVersion: '',
  fingerprint: '',
  shortFingerprint: '',
  verified: false,
  verifiedAt: null,
  fileCount: 0,
  packageSize: 0,
  generatedAt: null,
  generatedBy: null,
};

// Fingerprint response
export const FingerprintResponse = {
  packageId: '',
  fingerprint: '',
  shortFingerprint: '',
  algorithm: '',
  generatedAt: '',
  verified: false,
};

// Verification result
export const VerificationResult = {
  packageId: '',
  packageCode: '',
  verified: false,
  fingerprint: '',
  shortFingerprint: '',
  fileCount: 0,
  failedFiles: [],
  combinedHashMatch: false,
  verifiedAt: '',
  verifiedBy: '',
  result: '',
};