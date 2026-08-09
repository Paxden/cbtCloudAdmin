/**
 * Package Signature Type Definitions
 * Based on backend Package Signature Service
 */

// Signature status enum
export const SignatureStatus = {
  PENDING: 'PENDING',
  SIGNING: 'SIGNING',
  SIGNED: 'SIGNED',
  VERIFIED: 'VERIFIED',
  FAILED: 'FAILED',
  REVOKED: 'REVOKED',
};

// Signature status labels
export const SignatureStatusLabels = {
  PENDING: 'Pending',
  SIGNING: 'Signing',
  SIGNED: 'Signed',
  VERIFIED: 'Verified',
  FAILED: 'Failed',
  REVOKED: 'Revoked',
};

// Signature status colors
export const SignatureStatusColors = {
  PENDING: '#9e9e9e',
  SIGNING: '#ff9800',
  SIGNED: '#2196f3',
  VERIFIED: '#4caf50',
  FAILED: '#f44336',
  REVOKED: '#e91e63',
};

// Signature record
export const SignatureRecordShape = {
  _id: '',
  packageId: '',
  encryptionId: '',
  signatureVersion: '1.0.0',
  algorithm: 'Ed25519',
  status: '',
  signature: '',
  publicKeyIdentifier: '',
  publicKey: '',
  payloadHash: '',
  payloadHashAlgorithm: 'sha512',
  payloadString: '',
  nonce: '',
  signingContext: {},
  verification: {
    verified: false,
    verifiedBy: '',
    verifiedAt: '',
    result: '',
    details: '',
  },
  revocation: {
    revoked: false,
    revokedBy: '',
    revokedAt: '',
    reason: '',
  },
  metadata: {
    signatureSize: 0,
    keySize: 0,
    payloadSize: 0,
    generationTime: 0,
  },
  errorDetails: {
    code: '',
    message: '',
    stack: '',
    timestamp: null,
  },
  audit: {
    signedBy: '',
    signedAt: '',
    lastModifiedBy: '',
    lastModifiedAt: '',
    ipAddress: '',
    userAgent: '',
  },
  createdAt: '',
  updatedAt: '',
};

// Signature status response
export const SignatureStatusResponse = {
  packageId: '',
  status: '',
  algorithm: '',
  signatureVersion: '',
  publicKeyIdentifier: '',
  verified: false,
  verifiedAt: null,
  signedAt: null,
  signedBy: null,
  revoked: false,
  metadata: {},
};

// Verification result
export const VerificationResult = {
  packageId: '',
  verified: false,
  result: '',
  details: '',
  verifiedAt: '',
  verifiedBy: '',
};

// Sign request
export const SignRequest = {
  packageId: '',
};

// Revoke request
export const RevokeRequest = {
  packageId: '',
  reason: '',
};