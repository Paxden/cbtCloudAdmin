/**
 * Package Version Type Definitions
 * Based on backend Package Version Service
 */

// Version status enum
export const VersionStatus = {
  GENERATING: 'GENERATING',
  GENERATED: 'GENERATED',
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  REVOKED: 'REVOKED',
};

// Version status labels
export const VersionStatusLabels = {
  GENERATING: 'Generating',
  GENERATED: 'Generated',
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  REVOKED: 'Revoked',
};

// Version status colors
export const VersionStatusColors = {
  GENERATING: '#ff9800',
  GENERATED: '#2196f3',
  DRAFT: '#9e9e9e',
  ACTIVE: '#4caf50',
  ARCHIVED: '#757575',
  REVOKED: '#f44336',
};

// Change types
export const ChangeTypes = {
  CANDIDATES_ADDED: 'CANDIDATES_ADDED',
  CANDIDATES_REMOVED: 'CANDIDATES_REMOVED',
  CANDIDATES_MODIFIED: 'CANDIDATES_MODIFIED',
  BLUEPRINT_CHANGED: 'BLUEPRINT_CHANGED',
  CONFIGURATION_CHANGED: 'CONFIGURATION_CHANGED',
  RULES_CHANGED: 'RULES_CHANGED',
  SCHEDULE_CHANGED: 'SCHEDULE_CHANGED',
  SECURITY_UPDATE: 'SECURITY_UPDATE',
  CENTRE_CHANGED: 'CENTRE_CHANGED',
  EXAM_METADATA_CHANGED: 'EXAM_METADATA_CHANGED',
};

// Change type labels
export const ChangeTypeLabels = {
  CANDIDATES_ADDED: 'Candidates Added',
  CANDIDATES_REMOVED: 'Candidates Removed',
  CANDIDATES_MODIFIED: 'Candidates Modified',
  BLUEPRINT_CHANGED: 'Blueprint Changed',
  CONFIGURATION_CHANGED: 'Configuration Changed',
  RULES_CHANGED: 'Rules Changed',
  SCHEDULE_CHANGED: 'Schedule Changed',
  SECURITY_UPDATE: 'Security Update',
  CENTRE_CHANGED: 'Centre Changed',
  EXAM_METADATA_CHANGED: 'Exam Metadata Changed',
};

// Change severity
export const ChangeSeverity = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  CRITICAL: 'CRITICAL',
};

// Change severity colors
export const ChangeSeverityColors = {
  PATCH: '#9e9e9e',
  MINOR: '#2196f3',
  MAJOR: '#ff9800',
  CRITICAL: '#f44336',
};

// Version change
export const VersionChangeShape = {
  type: '',
  description: '',
  severity: '',
  field: '',
  oldValue: null,
  newValue: null,
};

// Version snapshot
export const VersionSnapshotShape = {
  examCode: '',
  examName: '',
  centreCode: '',
  centreName: '',
  configuration: {},
  blueprint: {},
  rules: {},
  schedule: {},
};

// Package Version
export const PackageVersionShape = {
  _id: '',
  packageId: '',
  parentVersionId: '',
  versionNumber: 0,
  versionLabel: '',
  versionCode: '',
  versionHash: '',
  changeReason: '',
  changeDescription: '',
  changes: [],
  severity: '',
  status: '',
  supersedesVersion: '',
  snapshot: VersionSnapshotShape,
  metadata: {
    candidateCount: 0,
    questionCount: 0,
    packageSize: 0,
    generatedBy: '',
    generatedAt: '',
  },
  timeline: {
    generatedAt: '',
    activatedAt: '',
    archivedAt: '',
    revokedAt: '',
  },
  archiveReason: '',
  revokeReason: '',
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

// Create version request
export const CreateVersionRequest = {
  packageId: '',
  changeReason: '',
  changeDescription: '',
  changes: [],
  snapshot: {},
};

// Compare versions result
export const CompareVersionsResult = {
  packageId: '',
  version1: {
    id: '',
    versionNumber: 0,
    versionLabel: '',
    versionCode: '',
    status: '',
    severity: '',
    candidateCount: 0,
    questionCount: 0,
    packageSize: 0,
    generatedAt: '',
    changeReason: '',
    changeDescription: '',
    changes: [],
  },
  version2: {
    id: '',
    versionNumber: 0,
    versionLabel: '',
    versionCode: '',
    status: '',
    severity: '',
    candidateCount: 0,
    questionCount: 0,
    packageSize: 0,
    generatedAt: '',
    changeReason: '',
    changeDescription: '',
    changes: [],
  },
  differences: {
    candidateCount: 0,
    questionCount: 0,
    packageSize: 0,
    statusChanged: false,
    severityChanged: false,
    detectedChanges: [],
    totalChanges: 0,
  },
};