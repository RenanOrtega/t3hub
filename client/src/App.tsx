import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Layout } from "./components/layout";
import { ErrorBoundary } from "./components/error-boundary";
import { ProtectedRoute } from "./components/protected-route";
import { HomePage } from "./pages/home-page";
import { PlayersPage } from "./pages/players-page";
import { MyProfilePage } from "./pages/my-profile-page";
import { OrganizationsPage } from "./pages/organizations-page";
import { OrganizationDetailPage } from "./pages/organization-detail-page";
import { OrganizationFormPage } from "./pages/organization-form-page";
import { TeamFormPage } from "./pages/team-form-page";
import { ScrimBoardPage } from "./pages/scrim-board-page";
import { LoginPage } from "./pages/login-page";
import { AuthCallbackPage } from "./pages/auth-callback-page";
import { ProfilePage } from "./pages/profile-page";
import { OnboardingPage } from "./pages/onboarding-page";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/players"
                element={
                  <ProtectedRoute>
                    <PlayersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MyProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile/:playerId" element={<ProfilePage />} />
              <Route
                path="/my-organizations/new"
                element={
                  <ProtectedRoute>
                    <OrganizationFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-organizations/:organizationId/edit"
                element={
                  <ProtectedRoute>
                    <OrganizationFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizations"
                element={
                  <ProtectedRoute>
                    <OrganizationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizations/:organizationId"
                element={
                  <ProtectedRoute>
                    <OrganizationDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizations/:organizationId/teams/new"
                element={
                  <ProtectedRoute>
                    <TeamFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams/:teamId/edit"
                element={
                  <ProtectedRoute>
                    <TeamFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scrims"
                element={
                  <ProtectedRoute>
                    <ScrimBoardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
