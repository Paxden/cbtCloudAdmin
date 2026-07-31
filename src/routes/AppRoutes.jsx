/**
 * App Routes
 * Main routing configuration
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import BlankLayout from "../layouts/BlankLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Auth Provider
import { AuthProvider } from "../hooks/useAuth.jsx";

// Auth Pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ChangePassword from "../pages/auth/ChangePassword";
import Unauthorized from "../pages/auth/Unauthorized";
import NotFound from "../pages/auth/NotFound";

// Pages
import DashboardHome from "../pages/dashboard/DashboardHome";
import Profile from "../pages/profile/Profile";
import QuestionCategories from "../pages/questionBank/categories/QuestionCategories";
import Subjects from "../pages/questionBank/subjects/Subjects";
import Topics from "../pages/questionBank/topics/Topics";
import EditorDemo from "../pages/editor/EditorDemo";
import QuestionBank from "../pages/questionBank/QuestionBank";
import CreateQuestion from "../pages/questionBuilder/CreateQuestion";
import EditQuestion from "../pages/questionBuilder/EditQuestion";
import MediaLibrary from "../pages/media/MediaLibrary";
import BulkImport from "../pages/questionImport/BulkImport";
import AdvancedQuestionSearch from "../pages/questionSearch/AdvancedQuestionSearch";
import QuestionPreview from "../pages/questionPreview/QuestionPreview";
import QuestionApprovalQueue from "../pages/questionApproval/QuestionApprovalQueue";
import QuestionReview from "../pages/questionApproval/QuestionReview";
import QuestionVersionHistory from "../pages/questionVersions/QuestionVersionHistory";
import QuestionAnalytics from "../pages/questionAnalytics/QuestionAnalytics";

// Phase 3 - Examination Modules
import Examinations from "../pages/examinations/Examinations";
import ExaminationDetail from "../pages/examinations/ExaminationDetail";
import ExaminationFormPage from "../pages/examinations/ExaminationFormPage";
import CandidateImport from "../pages/candidateImport/CandidateImport";
import CandidateList from "../pages/candidates/CandidateList";
import CandidateDetails from "../pages/candidates/CandidateDetails";
import EditCandidate from "../pages/candidates/EditCandidate";
import CentreAssignment from "../pages/centreAssignment/CentreAssignment";
import AssignmentHistory from "../pages/centreAssignment/AssignmentHistory";
// Add imports
import CentreList from "../pages/centres/CentreList";
import CentreDetails from "../pages/centres/CentreDetails";
import CentreFormPage from "../pages/centres/CentreFormPage";
import ExaminationBlueprint from "../pages/examinationBlueprint/ExaminationBlueprint";
import BlueprintDetails from "../pages/examinationBlueprint/BlueprintDetails";
import QuestionSelection from "../pages/questionSelection/QuestionSelection";
import PaperComposition from "../pages/questionSelection/PaperComposition";
import PaperPreview from "../pages/questionSelection/PaperPreview";
import ExaminationPolicies from "../pages/examinationPolicies/ExaminationPolicies";
import ExaminationSchedule from "../pages/examinationSchedule/ExaminationSchedule";
import SessionCalendar from "../pages/examinationSchedule/SessionCalendar";
import ExaminationInstructions from "../pages/examinationInstructions/ExaminationInstructions";
import ExaminationPreview from "../pages/examinationPreview/ExaminationPreview";
// Add imports
import ExaminationValidation from "../pages/examinationValidation/ExaminationValidation";

// Add routes inside DashboardLayout

// Add routes inside DashboardLayout

// Add route inside DashboardLayout

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardHome />} />
              {/* Profile */}
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/profile/change-password"
                element={<ChangePassword />}
              />
              {/* ============================================================
                  PHASE 2 - QUESTION BANK MODULES
                  ============================================================ */}
              {/* Question Bank - Categories, Subjects, Topics */}
              <Route
                path="/question-bank/categories"
                element={<QuestionCategories />}
              />
              <Route path="/question-bank/subjects" element={<Subjects />} />
              <Route path="/question-bank/topics" element={<Topics />} />
              {/* Question Bank - Editor Demo */}
              <Route path="/editor-demo" element={<EditorDemo />} />
              {/* Question Bank - Main */}
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route
                path="/question-bank/questions/new"
                element={<CreateQuestion />}
              />
              <Route
                path="/question-bank/questions/:id/edit"
                element={<EditQuestion />}
              />
              {/* Question Bank - Preview */}
              <Route
                path="/question-bank/preview/demo"
                element={<QuestionPreview />}
              />
              <Route
                path="/question-bank/questions/:questionId/preview"
                element={<QuestionPreview />}
              />
              {/* Media Library */}
              <Route path="/question-bank/media" element={<MediaLibrary />} />
              {/* Bulk Import */}
              <Route path="/question-bank/import" element={<BulkImport />} />
              {/* Advanced Search */}
              <Route
                path="/question-bank/search"
                element={<AdvancedQuestionSearch />}
              />
              {/* Question Approval */}
              <Route
                path="/question-approval"
                element={<QuestionApprovalQueue />}
              />
              <Route
                path="/question-approval/review/:questionId"
                element={<QuestionReview />}
              />
              {/* Reviews - Redirect to Approval (optional) */}
              <Route
                path="/reviews"
                element={<Navigate to="/question-approval" replace />}
              />
              {/* Version */}
              <Route
                path="/question-bank/questions/:questionId/versions"
                element={<QuestionVersionHistory />}
              />
              <Route
                path="/question-bank/statistics"
                element={<QuestionAnalytics />}
              />
              {/* ============================================================
                  PHASE 3 - EXAMINATION MODULES
                  ============================================================ */}
              {/* Module 1: Examination Creation */}
              // Add routes inside DashboardLayout
              <Route path="/examinations" element={<Examinations />} />
              <Route
                path="/examinations/create"
                element={<ExaminationFormPage />}
              />
              <Route path="/examinations/:id" element={<ExaminationDetail />} />
              <Route
                path="/examinations/:id/edit"
                element={<ExaminationFormPage />}
              />
              <Route
                path="/examinations/:id/clone"
                element={<ExaminationFormPage />}
              />
              {/* Candidate */}
              <Route path="/candidate-import" element={<CandidateImport />} />
              <Route path="/candidates" element={<CandidateList />} />
              <Route path="/candidates/:id" element={<CandidateDetails />} />
              <Route path="/candidates/:id/edit" element={<EditCandidate />} />
              <Route path="/centres" element={<CentreList />} />
              <Route path="/centres/create" element={<CentreFormPage />} />
              <Route path="/centres/:id" element={<CentreDetails />} />
              <Route path="/centres/:id/edit" element={<CentreFormPage />} />
              <Route
                path="/centres/:id/assign-manager"
                element={<CentreFormPage />}
              />
              <Route path="/centre-assignment" element={<CentreAssignment />} />
              <Route
                path="/centre-assignment/history"
                element={<AssignmentHistory />}
              />
              <Route
                path="/exams/blueprint"
                element={<ExaminationBlueprint />}
              />
              <Route
                path="/examination-blueprint/:id"
                element={<BlueprintDetails />}
              />
              <Route
                path="/exams/question-selection"
                element={<QuestionSelection />}
              />
              <Route
                path="/exams/question-selection/composition"
                element={<PaperComposition />}
              />
              <Route
                path="/exams/question-selection/preview"
                element={<PaperPreview />}
              />
              <Route path="/exams/rules" element={<ExaminationPolicies />} />
              <Route
                path="/exams/scheduling"
                element={<ExaminationSchedule />}
              />
              <Route
                path="/exams/scheduling/calendar"
                element={<SessionCalendar />}
              />
              <Route
                path="/exams/instructions"
                element={<ExaminationInstructions />}
              />
              <Route path="/exams/preview" element={<ExaminationPreview />} />
              <Route
                path="/exams/validation"
                element={<ExaminationValidation />}
              />
              <Route
                path="/exams/validation/history"
                element={<ExaminationValidation />}
              />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route element={<BlankLayout />}>
            <Route path="/403" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
          </Route>

          {/* 404 - Catch all */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default AppRoutes;
