/* eslint-disable no-unused-vars */
/**
 * Menu Items Constants
 * Centralized menu configuration with permissions
 * Separate from navigation to avoid circular dependencies
 *
 * PHASE 3 - Examination Management Modules
 * PHASE 4 - Package Management Modules (continuation under Examination Lifecycle)
 */

import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Subject as SubjectIcon,
  Topic as TopicIcon,
  QuestionAnswer as QuestionIcon,
  LibraryBooks as MediaIcon,
  ImportExport as ImportIcon,
  Search as SearchIcon,
  Assessment as StatisticsIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Description as ReportIcon,
  Settings as SettingsIcon,
  CheckCircle as ReviewIcon,
  RateReview as ApprovalIcon,
  AccountTree as InstanceIcon, 
  Preview as PreviewIcon,
  History as VersionIcon,
  // Phase 3 Icons
  Assignment as ExamIcon,
  PersonAdd as CandidateImportIcon,
  PersonSearch as CandidateManagementIcon,
  LocationOn as CentreAssignmentIcon,
  Architecture as BlueprintIcon,
  Construction as PaperCompositionIcon,
  Security as PolicyIcon,
  Schedule as SchedulingIcon,
  Visibility as PreviewDashboardIcon,
  Verified as ValidationIcon,
  // Phase 4 Icons - Package Management
  Dashboard as PackageDashboardIcon,
  AddBox as PackageGeneratorIcon,
  Article as CandidatePapersIcon,
  Lock as EncryptionIcon,
  CloudUpload as DistributionIcon,
  Download as DownloadsIcon,
  Timeline as VersionsIcon,
  History as PackageHistoryIcon,
  CheckCircle as SignatureIcon,
  Check as ChecksumIcon,
} from "@mui/icons-material";

import { ROLES } from "./roles";

export const MENU_ITEMS = [
  // ============================================================
  // DASHBOARD
  // ============================================================
  {
    id: "dashboard",
    title: "Dashboard",
    icon: DashboardIcon,
    path: "/dashboard",
    permissions: [],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
  },

  // ============================================================
  // PHASE 2 - QUESTION BANK MODULES
  // ============================================================
  {
    id: "questionBank",
    title: "Question Bank",
    icon: QuestionIcon,
    permissions: [],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
    children: [
      {
        id: "categories",
        title: "Categories",
        icon: CategoryIcon,
        path: "/question-bank/categories",
        permissions: ["VIEW_CATEGORY"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "subjects",
        title: "Subjects",
        icon: SubjectIcon,
        path: "/question-bank/subjects",
        permissions: ["VIEW_SUBJECT"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "topics",
        title: "Topics",
        icon: TopicIcon,
        path: "/question-bank/topics",
        permissions: ["VIEW_TOPIC"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "questionBankList",
        title: "Question Bank",
        icon: QuestionIcon,
        path: "/question-bank",
        permissions: ["VIEW_QUESTION"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "mediaLibrary",
        title: "Media Library",
        icon: MediaIcon,
        path: "/question-bank/media",
        permissions: ["VIEW_MEDIA"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
      },
      {
        id: "bulkImport",
        title: "Bulk Import",
        icon: ImportIcon,
        path: "/question-bank/import",
        permissions: ["VIEW_IMPORT_REPORT"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
      },
      {
        id: "search",
        title: "Search",
        icon: SearchIcon,
        path: "/question-bank/search",
        permissions: ["VIEW_QUESTION"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "statistics",
        title: "Statistics",
        icon: StatisticsIcon,
        path: "/question-bank/statistics",
        permissions: ["VIEW_STATISTICS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
      },
    ],
  },
  {
    id: "approval",
    title: "Approval",
    icon: ApprovalIcon,
    path: "/question-approval",
    permissions: ["REVIEW_QUESTION"],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
  },

  // ============================================================
  // PHASE 3 & 4 - EXAMINATION LIFECYCLE
  // (Examination Management + Package Preparation)
  // ============================================================
  {
    id: "examinationLifecycle",
    title: "Examination Lifecycle",
    icon: ExamIcon,
    permissions: [],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
    children: [
      // ==========================================================
      // PHASE 3 - Examination Planning
      // ==========================================================
      // Module 1: Examination Creation
      {
        id: "examinations",
        title: "Examinations",
        icon: ExamIcon,
        path: "/examinations",
        permissions: ["VIEW_EXAMS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 2: Candidate Import
      {
        id: "candidateImport",
        title: "Candidate Import",
        icon: CandidateImportIcon,
        path: "/candidate-import",
        permissions: ["IMPORT_CANDIDATES"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 3: Candidate Management
      {
        id: "candidates",
        title: "Candidates",
        icon: CandidateManagementIcon,
        path: "/candidates",
        permissions: ["VIEW_CANDIDATES"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 4: Centre Assignment
      {
        id: "centreAssignment",
        title: "Centre Assignment",
        icon: CentreAssignmentIcon,
        path: "/centre-assignment",
        permissions: ["ASSIGN_CANDIDATES"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 5: Examination Blueprint
      {
        id: "blueprint",
        title: "Examination Blueprint",
        icon: BlueprintIcon,
        path: "/exams/blueprint",
        permissions: ["VIEW_EXAMS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 6: Question Selection & Paper Composition
      {
        id: "questionSelection",
        title: "Question Selection",
        icon: PaperCompositionIcon,
        path: "/exams/question-selection",
        permissions: ["VIEW_QUESTION"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 7: Examination Policy & Security Rules
      {
        id: "examinationRules",
        title: "Examination Rules",
        icon: PolicyIcon,
        path: "/exams/rules",
        permissions: ["VIEW_EXAMS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 8: Examination Scheduling & Session Management
      {
        id: "scheduling",
        title: "Scheduling",
        icon: SchedulingIcon,
        path: "/exams/scheduling",
        permissions: ["VIEW_EXAMS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 9: Examination Instructions & Resources
      {
        id: "instructions",
        title: "Instructions",
        icon: ReportIcon,
        path: "/exams/instructions",
        permissions: ["VIEW_EXAMS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 10: Examination Preview & Readiness Dashboard
      {
        id: "preview",
        title: "Preview",
        icon: PreviewDashboardIcon,
        path: "/exams/preview",
        permissions: ["VIEW_EXAMS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 11: Examination Validation & Pre-Deployment Checks
      {
        id: "validation",
        title: "Validation",
        icon: ValidationIcon,
        path: "/exams/validation",
        permissions: ["VALIDATE_EXAMINATION"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
      },

      // ==========================================================
      // DIVIDER - Phase 4: Package Preparation
      // ==========================================================
      {
        id: "packageDivider",
        title: "Package Preparation",
        divider: true,
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 1: Package Dashboard
      {
        id: "packageDashboard",
        title: "Package Dashboard",
        icon: PackageDashboardIcon,
        path: "/packages",
        permissions: ["VIEW_PACKAGES"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "examinationInstances",
        title: "Examination Instances",
        icon: InstanceIcon,
        path: "/instances",
        permissions: ["VIEW_INSTANCES"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 2: Package Generator
      {
        id: "PackageGenerator",
        title: "Package Generator",
        icon: PackageGeneratorIcon,
        path: "/generate",
        permissions: ["GENERATE_PACKAGE"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
      },

      // Module 3: Candidate Papers
      {
        id: "candidatePapers",
        title: "Candidate Papers",
        icon: CandidatePapersIcon,
        path: "/papers",
        permissions: ["VIEW_PAPERS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "Encryption",
        title: "Encryption",
        icon: EncryptionIcon,
        path: "/encryption",
        permissions: ["VIEW_ENCRYPTION"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "Signature",
        title: "Signature",
        icon: SignatureIcon,
        path: "/signature",
        permissions: ["VIEW_SIGNATURE"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
      {
        id: "Checksum",
        title: "Checksum",
        icon: ChecksumIcon,
        path: "/checksum",
        permissions: ["VIEW_CHECKSUM"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
       {
        id: "packageBuilder",
        title: "Package Builder",
        icon: PackageGeneratorIcon,
        path: "/builder",
        permissions: ["BUILD_PACKAGE"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
      },

     

      // Module 5: Distribution
      {
        id: "distribution",
        title: "Distribution",
        icon: DistributionIcon,
        path: "/distribution",
        permissions: ["DISTRIBUTE_PACKAGE"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 6: Downloads
      {
        id: "downloads",
        title: "Downloads",
        icon: DownloadsIcon,
        path: "/downloads",
        permissions: ["VIEW_DOWNLOADS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 7: Versions
      {
        id: "packageVersions",
        title: "Versions",
        icon: VersionsIcon,
        path: "/versions",
        permissions: ["VIEW_VERSIONS"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },

      // Module 8: History
      {
        id: "packageHistory",
        title: "History",
        icon: PackageHistoryIcon,
        path: "/history",
        permissions: ["VIEW_HISTORY"],
        roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
      },
    ],
  },

  // ============================================================
  // CENTRE MANAGEMENT
  // ============================================================
  {
    id: "centres",
    title: "Centres",
    icon: SchoolIcon,
    path: "/centres",
    permissions: ["VIEW_CENTRES"],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
  },

  // ============================================================
  // USERS MANAGEMENT
  // ============================================================
  {
    id: "users",
    title: "Users",
    icon: PeopleIcon,
    path: "/users",
    permissions: ["VIEW_USERS"],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
  },

  // ============================================================
  // REPORTS
  // ============================================================
  {
    id: "reports",
    title: "Reports",
    icon: ReportIcon,
    path: "/reports",
    permissions: ["VIEW_REPORTS"],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN, ROLES.EXAM_MANAGER],
  },

  // ============================================================
  // SETTINGS
  // ============================================================
  {
    id: "settings",
    title: "Settings",
    icon: SettingsIcon,
    path: "/settings",
    permissions: ["VIEW_SETTINGS"],
    roles: [ROLES.SUPER_ADMIN, ROLES.TECH_ADMIN],
  },
];

export default MENU_ITEMS;
