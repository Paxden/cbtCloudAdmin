/**
 * API Endpoints Constants
 * Centralized API endpoint definitions
 */

const API_VERSION = "/api/v1";

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_VERSION}/auth/login`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    REFRESH: `${API_VERSION}/auth/refresh`,
    PROFILE: `${API_VERSION}/auth/profile`,
    FORGOT_PASSWORD: `${API_VERSION}/auth/forgot-password`,
    RESET_PASSWORD: `${API_VERSION}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_VERSION}/auth/change-password`,
    VALIDATE: `${API_VERSION}/auth/validate`,
  },

  // Users
  USERS: {
    BASE: `${API_VERSION}/users`,
    STATISTICS: `${API_VERSION}/users/statistics`,
  },

  // Question Bank
  QUESTION_BANK: {
    CATEGORIES: `${API_VERSION}/categories`,
    SUBJECTS: `${API_VERSION}/subjects`,
    TOPICS: `${API_VERSION}/topics`,
    DIFFICULTIES: `${API_VERSION}/difficulties`,
    QUESTION_TYPES: `${API_VERSION}/question-types`,
    QUESTIONS: `${API_VERSION}/questions`,
    MEDIA: `${API_VERSION}/media`,
    IMPORT: `${API_VERSION}/questions/import`,
    SEARCH: `${API_VERSION}/questions/search`,
    STATISTICS: `${API_VERSION}/questions/statistics`,
    PREVIEW: `${API_VERSION}/questions/preview`,
  },

  // Reviews
  REVIEWS: {
    BASE: `${API_VERSION}/reviews`,
    PENDING: `${API_VERSION}/reviews/pending`,
    STATISTICS: `${API_VERSION}/reviews/statistics`,
  },

  // Roles & Permissions
  ROLES: {
    BASE: `${API_VERSION}/roles`,
    PERMISSIONS: `${API_VERSION}/permissions`,
  },

  // Centres
  CENTRES: {
    BASE: `${API_VERSION}/centres`,
  },

  // Settings
  SETTINGS: {
    BASE: `${API_VERSION}/settings`,
    SECURITY: `${API_VERSION}/settings/security`,
    MAINTENANCE: `${API_VERSION}/settings/maintenance`,
  },

  // Audit
  AUDIT: {
    BASE: `${API_VERSION}/audit`,
    STATISTICS: `${API_VERSION}/audit/statistics`,
  },

  // ============================================================
  // PHASE 3 - EXAMINATION MODULES
  // ============================================================

  // Examinations
EXAMINATIONS: {
  BASE: `${API_VERSION}/examinations`,
  STATISTICS: `${API_VERSION}/examinations/stats`,
  CHECK_CODE: `${API_VERSION}/examinations/check-code`,
  CLONE: (id) => `${API_VERSION}/examinations/${id}/clone`,
  ARCHIVE: (id) => `${API_VERSION}/examinations/${id}/archive`,
  RESTORE: (id) => `${API_VERSION}/examinations/${id}/restore`,
},

  // Candidate Import
  CANDIDATE_IMPORT: {
    BASE: `${API_VERSION}/candidate-import`,
    HISTORY: `${API_VERSION}/candidate-import/history`,
    SUMMARY: (importId) =>
      `${API_VERSION}/candidate-import/summary/${importId}`,
    ERRORS: (importId) =>
      `${API_VERSION}/candidate-import/errors/${importId}/export`,
    TEMPLATE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates/import/template`,
    UPLOAD: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates/import/upload`,
    VALIDATE: (examinationId, fileId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates/import/validate/${fileId}`,
    PREVIEW: (examinationId, fileId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates/import/preview/${fileId}`,
    COMMIT: (examinationId, fileId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates/import/commit/${fileId}`,
  },

  // Candidate Management
  CANDIDATES: {
    BASE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates`,
    STATS: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates/stats`,
    BULK_STATUS: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/candidates/bulk-status`,
    BY_ID: (candidateId) => `${API_VERSION}/candidates/${candidateId}`,
    ACTIVATE: (candidateId) =>
      `${API_VERSION}/candidates/${candidateId}/activate`,
    DEACTIVATE: (candidateId) =>
      `${API_VERSION}/candidates/${candidateId}/deactivate`,
    DELETE: (candidateId) => `${API_VERSION}/candidates/${candidateId}/delete`,
    RESTORE: (candidateId) =>
      `${API_VERSION}/candidates/${candidateId}/restore`,
  },

  // Centre Assignment
  CENTRE_ASSIGNMENT: {
    ASSIGN: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/centres`,
    ASSIGN_CANDIDATES: (examinationId, centreId) =>
      `${API_VERSION}/examinations/${examinationId}/centres/${centreId}/candidates`,
    AUTO_ASSIGN: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/centres/auto-assign`,
    LIST: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/centre-assignments`,
    STATS: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/centre-assignments/stats`,
    REMOVE: (assignmentId) =>
      `${API_VERSION}/centre-assignments/${assignmentId}`,
    REMOVE_CENTRE: (assignmentId) =>
      `${API_VERSION}/centre-assignments/${assignmentId}/centre`,
  },

  // Examination Blueprint
  BLUEPRINT: {
    BASE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/blueprint`,
    LOCK: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/blueprint/lock`,
    UNLOCK: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/blueprint/unlock`,
    ARCHIVE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/blueprint/archive`,
    LIST: `${API_VERSION}/examinations/blueprints`,
    STATS: `${API_VERSION}/examinations/blueprints/stats`,
  },

  // Question Selection & Paper Composition
  PAPER: {
    COMPOSE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/paper`,
    GET: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/paper`,
    DELETE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/paper`,
    LOCK: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/paper/lock`,
    LIST: `${API_VERSION}/examinations/papers`,
    STATS: `${API_VERSION}/examinations/papers/stats`,
  },

  // Examination Policy
  POLICY: {
    BASE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/policy`,
    ACTIVATE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/policy/activate`,
    ARCHIVE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/policy/archive`,
    LIST: `${API_VERSION}/examinations/policies`,
    STATS: `${API_VERSION}/examinations/policies/stats`,
  },

  // Examination Scheduling
  SCHEDULING: {
    SESSIONS: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/sessions`,
    SESSION_BY_ID: (sessionId) => `${API_VERSION}/sessions/${sessionId}`,
    CANCEL: (sessionId) => `${API_VERSION}/sessions/${sessionId}/cancel`,
    SCHEDULE: (sessionId) => `${API_VERSION}/sessions/${sessionId}/schedule`,
    STATS: `${API_VERSION}/sessions/stats`,
  },

  // Examination Instructions
  INSTRUCTIONS: {
    BASE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/instructions`,
    BY_ID: (instructionId) => `${API_VERSION}/instructions/${instructionId}`,
    PUBLISH: (instructionId) =>
      `${API_VERSION}/instructions/${instructionId}/publish`,
    ARCHIVE: (instructionId) =>
      `${API_VERSION}/instructions/${instructionId}/archive`,
    STATS: `${API_VERSION}/instructions/stats`,
  },

  // Examination Preview & Readiness
  PREVIEW: {
    GET: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/preview`,
    READINESS: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/readiness`,
    CHECK: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/readiness/check`,
  },

  // Examination Validation
  VALIDATION: {
    VALIDATE: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/validate`,
    LATEST: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/validation`,
    HISTORY: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/validation/history`,
    PASSED: (examinationId) =>
      `${API_VERSION}/examinations/${examinationId}/validation/passed`,
    BY_ID: (validationId) => `${API_VERSION}/validations/${validationId}`,
    STATS: `${API_VERSION}/validations/stats`,
  },
};

export default API_ENDPOINTS;
