/**
 * Examination Instance Type Definitions
 * Based on backend exam instance service
 */

// Instance status enum
export const InstanceStatus = {
  DRAFT: 'DRAFT',
  GENERATING: 'GENERATING',
  GENERATED: 'GENERATED',
  LOCKED: 'LOCKED',
  ARCHIVED: 'ARCHIVED',
};

// Instance status labels
export const InstanceStatusLabels = {
  DRAFT: 'Draft',
  GENERATING: 'Generating',
  GENERATED: 'Generated',
  LOCKED: 'Locked',
  ARCHIVED: 'Archived',
};

// Instance status colors
export const InstanceStatusColors = {
  DRAFT: '#9e9e9e',
  GENERATING: '#ff9800',
  GENERATED: '#2196f3',
  LOCKED: '#4caf50',
  ARCHIVED: '#f44336',
};

// Blueprint snapshot structure
export const BlueprintSnapshotShape = {
  sections: [],
  totalQuestions: 0,
  totalMarks: 0,
  passingMarks: 0,
  negativeMarking: {
    enabled: false,
    value: 0,
  },
};

// Configuration snapshot structure
export const ConfigurationSnapshotShape = {
  duration: 0,
  maxAttempts: 1,
  allowedDevices: [],
  proctoringLevel: 'STANDARD',
  timeZone: 'UTC',
  lateEntryAllowed: false,
  lateEntryGracePeriod: 0,
  earlyExitAllowed: false,
  earlyExitGracePeriod: 0,
  showResults: false,
  resultsAvailability: 'AFTER_EXAM',
};

// Instructions snapshot structure
export const InstructionsSnapshotShape = {
  generalInstructions: '',
  technicalInstructions: '',
  securityInstructions: '',
  candidateConductRules: '',
  supportContact: '',
  additionalResources: [],
};

// Rules snapshot structure
export const RulesSnapshotShape = {
  allowedAttempts: 1,
  timeLimit: 0,
  questionNavigation: 'FREE',
  answerReview: 'ALLOWED',
  flaggingAllowed: true,
  calculatorAllowed: false,
  scratchPadAllowed: false,
  offlineMode: false,
  networkRequirements: '',
  systemRequirements: '',
};

// Schedule snapshot structure
export const ScheduleSnapshotShape = {
  sessions: [],
  startDate: null,
  endDate: null,
  timeZone: 'UTC',
  lateRegistrationCutoff: null,
  earlyDepartureCutoff: null,
  breakSchedule: [],
};

// Validation error/warning
export const ValidationItemShape = {
  field: '',
  code: '',
  message: '',
  severity: 'ERROR', // or 'WARNING'
};

// Exam Instance
export const ExamInstanceShape = {
  _id: '',
  instanceCode: '',
  examId: '',
  examCode: '',
  examName: '',
  examVersion: 1,
  blueprintSnapshot: BlueprintSnapshotShape,
  configurationSnapshot: ConfigurationSnapshotShape,
  instructionsSnapshot: InstructionsSnapshotShape,
  rulesSnapshot: RulesSnapshotShape,
  scheduleSnapshot: ScheduleSnapshotShape,
  approvedQuestionIds: [],
  approvedQuestionCount: 0,
  candidateCount: 0,
  centreCount: 0,
  assignedCentreIds: [],
  status: '',
  createdBy: '',
  updatedBy: '',
  createdAt: '',
  updatedAt: '',
  isDeleted: false,
  deletedAt: null,
  metadata: {
    instanceVersion: 1,
    previousInstanceId: null,
    notes: '',
  },
  validationErrors: [],
  validationWarnings: [],
};

// Create instance request
export const CreateInstanceRequest = {
  examId: '',
  notes: '',
};

// List instances response
export const InstanceListResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

// Instance statistics
export const InstanceStatistics = {
  DRAFT: 0,
  GENERATING: 0,
  GENERATED: 0,
  LOCKED: 0,
  ARCHIVED: 0,
  total: 0,
};