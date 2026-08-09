/**
 * Centre Package Type Definitions
 * Based on backend Centre Package Service
 */

// Package status enum
export const PackageStatus = {
  DRAFT: 'DRAFT',
  GENERATING: 'GENERATING',
  GENERATED: 'GENERATED',
  READY_FOR_ENCRYPTION: 'READY_FOR_ENCRYPTION',
  ENCRYPTED: 'ENCRYPTED',
  SIGNED: 'SIGNED',
  VALIDATED: 'VALIDATED',
  DOWNLOADED: 'DOWNLOADED',
  IMPORTED: 'IMPORTED',
  ACTIVATED: 'ACTIVATED',
  REVOKED: 'REVOKED',
  ARCHIVED: 'ARCHIVED',
};

// Package status labels
export const PackageStatusLabels = {
  DRAFT: 'Draft',
  GENERATING: 'Generating',
  GENERATED: 'Generated',
  READY_FOR_ENCRYPTION: 'Ready for Encryption',
  ENCRYPTED: 'Encrypted',
  SIGNED: 'Signed',
  VALIDATED: 'Validated',
  DOWNLOADED: 'Downloaded',
  IMPORTED: 'Imported',
  ACTIVATED: 'Activated',
  REVOKED: 'Revoked',
  ARCHIVED: 'Archived',
};

// Package status colors
export const PackageStatusColors = {
  DRAFT: '#9e9e9e',
  GENERATING: '#ff9800',
  GENERATED: '#2196f3',
  READY_FOR_ENCRYPTION: '#00bcd4',
  ENCRYPTED: '#4caf50',
  SIGNED: '#8bc34a',
  VALIDATED: '#009688',
  DOWNLOADED: '#3f51b5',
  IMPORTED: '#9c27b0',
  ACTIVATED: '#e91e63',
  REVOKED: '#f44336',
  ARCHIVED: '#757575',
};

// Package metadata
export const PackageMetadataShape = {
  generatedAt: '',
  generatedBy: '',
  instanceCode: '',
  examCode: '',
  examName: '',
  centreCode: '',
  centreName: '',
  version: 1,
  description: '',
};

// Exam info
export const ExamInfoShape = {
  examId: '',
  examCode: '',
  examName: '',
  examVersion: 1,
  description: '',
  duration: 0,
  totalMarks: 0,
  passingMarks: 0,
};

// Centre info
export const CentreInfoShape = {
  centreId: '',
  centreCode: '',
  centreName: '',
  centreAddress: {},
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  centreType: '',
  capacity: 0,
};

// Candidate paper
export const CandidatePaperShape = {
  candidateId: '',
  registrationNumber: '',
  paperId: '',
  paperCode: '',
  version: 1,
  sections: [],
  totalQuestions: 0,
  totalMarks: 0,
  generatedAt: '',
};

// Package validation
export const PackageValidationShape = {
  validated: false,
  errors: [],
  warnings: [],
  summary: {
    isValid: false,
    errorCount: 0,
    warningCount: 0,
  },
};

// Centre Package
export const CentrePackageShape = {
  _id: '',
  packageCode: '',
  instanceId: '',
  examId: '',
  centreId: '',
  centreName: '',
  centreCode: '',
  packageVersion: 1,
  candidateCount: 0,
  paperCount: 0,
  packageSize: 0,
  manifestVersion: '1.0.0',
  status: '',
  packageMetadata: PackageMetadataShape,
  examInfo: ExamInfoShape,
  centreInfo: CentreInfoShape,
  configurationSnapshot: {},
  blueprintSnapshot: {},
  rulesSnapshot: {},
  instructionsSnapshot: {},
  scheduleSnapshot: {},
  candidateList: [],
  candidatePapers: [],
  papersMetadata: {
    paperCount: 0,
    totalQuestions: 0,
    totalMarks: 0,
    averageQuestionsPerPaper: 0,
    generatedAt: '',
  },
  generatedBy: '',
  updatedBy: '',
  notes: '',
  validation: PackageValidationShape,
  generationTiming: {
    startedAt: '',
    completedAt: '',
    totalTimeMs: 0,
  },
  generationStats: {
    candidatesProcessed: 0,
    papersGenerated: 0,
    questionsIncluded: 0,
    sectionsIncluded: 0,
    skippedCandidates: 0,
    failedPaperGenerations: 0,
  },
  revokedAt: null,
  revokedBy: null,
  revocationReason: null,
  isDeleted: false,
  deletedAt: null,
  deletedBy: null,
  createdAt: '',
  updatedAt: '',
};

// Generate package request
export const GeneratePackageRequest = {
  instanceId: '',
  centreId: '',
  notes: '',
};

// Generate all packages request
export const GenerateAllPackagesRequest = {
  instanceId: '',
  centreIds: [],
  notes: '',
};

// Generation result
export const GenerationResultShape = {
  total: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  packages: [],
  errors: [],
};