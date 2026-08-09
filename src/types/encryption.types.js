/**
 * Package Encryption Type Definitions
 * Based on backend Package Encryption Service
 */

// Encryption status enum
export const EncryptionStatus = {
  PENDING: 'PENDING',
  ENCRYPTING: 'ENCRYPTING',
  ENCRYPTED: 'ENCRYPTED',
  FAILED: 'FAILED',
  REVOKED: 'REVOKED',
  DECRYPTING: 'DECRYPTING',
  DECRYPTED: 'DECRYPTED',
};

// Encryption status labels
export const EncryptionStatusLabels = {
  PENDING: 'Pending',
  ENCRYPTING: 'Encrypting',
  ENCRYPTED: 'Encrypted',
  FAILED: 'Failed',
  REVOKED: 'Revoked',
  DECRYPTING: 'Decrypting',
  DECRYPTED: 'Decrypted',
};

// Encryption status colors
export const EncryptionStatusColors = {
  PENDING: '#9e9e9e',
  ENCRYPTING: '#ff9800',
  ENCRYPTED: '#4caf50',
  FAILED: '#f44336',
  REVOKED: '#e91e63',
  DECRYPTING: '#2196f3',
  DECRYPTED: '#00bcd4',
};

// Asset types
export const AssetTypes = {
  CANDIDATE_PAPERS: 'CANDIDATE_PAPERS',
  CANDIDATE_DATA: 'CANDIDATE_DATA',
  QUESTIONS: 'QUESTIONS',
  EXAM_CONFIGURATION: 'EXAM_CONFIGURATION',
  BLUEPRINT: 'BLUEPRINT',
  RULES: 'RULES',
  INSTRUCTIONS: 'INSTRUCTIONS',
  SCHEDULE: 'SCHEDULE',
};

// Asset type labels
export const AssetTypeLabels = {
  CANDIDATE_PAPERS: 'Candidate Papers',
  CANDIDATE_DATA: 'Candidate Data',
  QUESTIONS: 'Questions',
  EXAM_CONFIGURATION: 'Exam Configuration',
  BLUEPRINT: 'Blueprint',
  RULES: 'Rules',
  INSTRUCTIONS: 'Instructions',
  SCHEDULE: 'Schedule',
};

// Encrypted file
export const EncryptedFileShape = {
  assetType: '',
  fileName: '',
  fileSize: 0,
  encryptedSize: 0,
  encryptedData: '',
  checksum: '',
  iv: '',
  authTag: '',
  encryptedAt: '',
};

// Encryption record
export const EncryptionRecordShape = {
  _id: '',
  packageId: '',
  instanceId: '',
  encryptionVersion: '1.0.0',
  algorithm: 'AES-256-GCM',
  keyIdentifier: '',
  status: '',
  initializationVector: '',
  authTag: '',
  encryptedFiles: [],
  totalEncryptedSize: 0,
  encryptedFileCount: 0,
  metadata: {
    encryptionTime: 0,
    keyRotation: false,
    previousKeyIdentifier: null,
  },
  errorDetails: {
    code: '',
    message: '',
    stack: '',
    timestamp: null,
  },
  audit: {
    encryptedBy: '',
    encryptedAt: '',
    lastModifiedBy: '',
    lastModifiedAt: '',
  },
  createdAt: '',
  updatedAt: '',
};

// Encryption status response
export const EncryptionStatusResponse = {
  packageId: '',
  status: '',
  algorithm: '',
  encryptionVersion: '',
  encryptedFiles: 0,
  totalEncryptedSize: 0,
  encryptedAt: '',
  encryptedBy: '',
};

// Decrypt asset response
export const DecryptAssetResponse = {
  success: true,
  assetType: '',
  fileName: '',
  fileSize: 0,
  encryptedSize: 0,
  decryptedData: null,
};

// Encrypt request
export const EncryptRequest = {
  packageId: '',
};

// Decrypt request
export const DecryptRequest = {
  packageId: '',
  assetType: '',
};