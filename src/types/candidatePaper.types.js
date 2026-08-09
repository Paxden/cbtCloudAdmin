/**
 * Candidate Paper Type Definitions
 * Based on backend Candidate Paper Service
 */

// Paper status enum
export const PaperStatus = {
  GENERATING: 'GENERATING',
  GENERATED: 'GENERATED',
  ENCRYPTED: 'ENCRYPTED',
  PACKAGED: 'PACKAGED',
  IMPORTED: 'IMPORTED',
  ACTIVATED: 'ACTIVATED',
  ARCHIVED: 'ARCHIVED',
  FAILED: 'FAILED',
};

// Paper status labels
export const PaperStatusLabels = {
  GENERATING: 'Generating',
  GENERATED: 'Generated',
  ENCRYPTED: 'Encrypted',
  PACKAGED: 'Packaged',
  IMPORTED: 'Imported',
  ACTIVATED: 'Activated',
  ARCHIVED: 'Archived',
  FAILED: 'Failed',
};

// Paper status colors
export const PaperStatusColors = {
  GENERATING: '#ff9800',
  GENERATED: '#2196f3',
  ENCRYPTED: '#00bcd4',
  PACKAGED: '#4caf50',
  IMPORTED: '#8bc34a',
  ACTIVATED: '#009688',
  ARCHIVED: '#9e9e9e',
  FAILED: '#f44336',
};

// Selection rule types
export const SelectionRule = {
  RANDOM: 'RANDOM',
  FIXED: 'FIXED',
  MIXED: 'MIXED',
};

// Question order types
export const QuestionOrder = {
  RANDOM: 'RANDOM',
  BLUEPRINT: 'BLUEPRINT',
  FIXED: 'FIXED',
};

// Option order types
export const OptionOrder = {
  RANDOM: 'RANDOM',
  FIXED: 'FIXED',
};

// Question stats
export const QuestionStatsShape = {
  totalQuestions: 0,
  byDifficulty: {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  },
  byType: {},
  bySubject: {},
  byTopic: {},
  bySection: {},
};

// Paper validation
export const PaperValidationShape = {
  validated: false,
  errors: [],
  warnings: [],
  summary: {
    isValid: false,
    errorCount: 0,
    warningCount: 0,
  },
};

// Paper compliance
export const PaperComplianceShape = {
  blueprintCompliant: true,
  difficultyDistributionMet: true,
  questionTypeDistributionMet: true,
  subjectDistributionMet: true,
  topicDistributionMet: true,
  marksAllocationCorrect: true,
  uniqueQuestions: true,
  checks: [],
};

// Candidate Paper
export const CandidatePaperShape = {
  _id: '',
  paperCode: '',
  instanceId: '',
  examId: '',
  candidateId: '',
  candidateNumber: '',
  centreId: '',
  centreCode: '',
  blueprintSnapshot: {},
  configurationSnapshot: {},
  questionSelectionRule: {
    type: '',
    parameters: {},
    seed: '',
    version: '',
  },
  questionOrder: {
    type: '',
    seed: '',
    algorithm: '',
  },
  optionOrder: {
    type: '',
    seed: '',
    algorithm: '',
  },
  questions: [],
  questionCount: 0,
  totalMarks: 0,
  duration: 0,
  version: 1,
  status: '',
  generatedBy: '',
  updatedBy: '',
  notes: '',
  questionStats: QuestionStatsShape,
  generationMetadata: {
    startedAt: '',
    completedAt: '',
    totalTimeMs: 0,
    questionSelectionTime: 0,
    randomizationTime: 0,
    validationTime: 0,
    storageTime: 0,
  },
  generationStats: {
    questionsConsidered: 0,
    questionsSelected: 0,
    questionsRejected: 0,
    selectionIterations: 0,
    randomizationIterations: 0,
    validationErrors: 0,
  },
  validation: PaperValidationShape,
  compliance: PaperComplianceShape,
  isDeleted: false,
  deletedAt: null,
  deletedBy: null,
  createdAt: '',
  updatedAt: '',
};

// Generate paper request
export const GeneratePaperRequest = {
  instanceId: '',
  candidateId: '',
  selectionRule: 'RANDOM',
  questionOrder: 'RANDOM',
  optionOrder: 'FIXED',
  notes: '',
};

// Generate centre papers request
export const GenerateCentrePapersRequest = {
  instanceId: '',
  centreId: '',
  candidateIds: [],
  selectionRule: 'RANDOM',
  questionOrder: 'RANDOM',
  optionOrder: 'FIXED',
  notes: '',
};

// Generate all papers request
export const GenerateAllPapersRequest = {
  instanceId: '',
  centreIds: [],
  selectionRule: 'RANDOM',
  questionOrder: 'RANDOM',
  optionOrder: 'FIXED',
  notes: '',
};

// Generation result
export const GenerationResultShape = {
  total: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  papers: [],
  errors: [],
  centreResults: [],
};