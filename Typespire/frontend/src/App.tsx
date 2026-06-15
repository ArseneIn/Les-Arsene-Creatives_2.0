import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import FacilitatorLayout from './layouts/FacilitatorLayout';
import FacilitatorDashboard from './pages/FacilitatorDashboard';
import InstitutionAdminLayout from './layouts/InstitutionAdminLayout';
import InstitutionAdminDashboard from './pages/InstitutionAdminDashboard';
import PlatformAdminLayout from './layouts/PlatformAdminLayout';
import PlatformAdminDashboard from './pages/PlatformAdminDashboard';
import PlatformAnalytics from './pages/PlatformAnalytics';
import PlatformBilling from './pages/PlatformBilling';
import PlatformLogs from './pages/PlatformLogs';
import PlatformSettings from './pages/PlatformSettings';
import TypingTest from './pages/TypingTest';
import StudentResults from './pages/StudentResults';
import FacilitatorTestLaunch from './pages/FacilitatorTestLaunch';
import InstitutionSettings from './pages/InstitutionSettings';
import InstitutionIntakes from './pages/InstitutionIntakes';
import InstitutionFacilitators from './pages/InstitutionFacilitators';
import InstitutionAnalytics from './pages/InstitutionAnalytics';
import InstitutionReports from './pages/InstitutionReports';
import StudentPerformance from './pages/StudentPerformance';
import InstitutionTests from './pages/InstitutionTests';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './components/RequireAuth';
import { UserRole } from './types/auth';

import { UserProgressProvider } from './context/UserProgressContext';
import { FacilitatorProvider } from './context/FacilitatorContext';
import { InstitutionProvider } from './context/InstitutionContext';
import { AuthProvider } from './context/AuthProvider';
import { AlertProvider } from './context/AlertContext';
import StudentHistory from './pages/StudentHistory';
import StudentPractice from './pages/StudentPractice';
import StudentTests from './pages/StudentTests';

import FacilitatorClasses from './pages/FacilitatorClasses';
import FacilitatorReports from './pages/FacilitatorReports';
import FacilitatorSettings from './pages/FacilitatorSettings';
import FacilitatorAnalytics from './pages/FacilitatorAnalytics';
import SSOCallback from './pages/SSOCallback';

import TypingLoader from './components/common/TypingLoader';
import MobileTypingBlocker from './components/common/MobileTypingBlocker';
import { useAuth } from './context/AuthContext';

const AuthLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();
  if (isLoading) return <TypingLoader />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <AuthLoader>
        <AlertProvider>
          <UserProgressProvider>
          <InstitutionProvider>
            <FacilitatorProvider>
              <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/sso" element={<SSOCallback />} />

                {/* Public or Protected Test Route? Assuming Protected for now or Public? */}
                {/* TypingTest might be accessible to anyone or just students? Let's assume students for now. */}
                <Route element={<RequireAuth allowedRoles={[UserRole.STUDENT, UserRole.FACILITATOR, UserRole.INSTITUTION_ADMIN, UserRole.PLATFORM_ADMIN]} />}>
                  <Route path="/test" element={<MobileTypingBlocker><TypingTest /></MobileTypingBlocker>} />
                </Route>

                <Route element={<RequireAuth allowedRoles={[UserRole.STUDENT]} />}>
                  <Route path="/" element={<StudentLayout />}>
                    <Route index element={<StudentDashboard />} />
                    <Route path="tests" element={<StudentTests />} />
                    <Route path="results" element={<StudentResults />} />
                    <Route path="practice" element={<StudentPractice />} />
                    <Route path="history" element={<StudentHistory />} />
                  </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[UserRole.FACILITATOR]} />}>
                  <Route path="/facilitator" element={<FacilitatorLayout />}>
                    <Route index element={<FacilitatorDashboard />} />
                    <Route path="launch" element={<FacilitatorTestLaunch />} />
                    <Route path="classes" element={<FacilitatorClasses />} />
                    <Route path="analytics" element={<FacilitatorAnalytics />} />
                    <Route path="reports" element={<FacilitatorReports />} />
                    <Route path="settings" element={<FacilitatorSettings />} />
                  </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[UserRole.INSTITUTION_ADMIN]} />}>
                  <Route path="/admin" element={<InstitutionAdminLayout />}>
                    <Route index element={<InstitutionAdminDashboard />} />
                    <Route path="intakes" element={<InstitutionIntakes />} />
                    <Route path="facilitators" element={<InstitutionFacilitators />} />
                    <Route path="analytics" element={<InstitutionAnalytics />} />
                    <Route path="tests" element={<InstitutionTests />} />
                    <Route path="performance" element={<StudentPerformance />} />
                    <Route path="reports" element={<InstitutionReports />} />
                    <Route path="settings" element={<InstitutionSettings />} />
                  </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[UserRole.PLATFORM_ADMIN]} />}>
                  <Route path="/super-admin" element={<PlatformAdminLayout />}>
                    <Route index element={<PlatformAdminDashboard />} />
                    <Route path="analytics" element={<PlatformAnalytics />} />
                    <Route path="billing" element={<PlatformBilling />} />
                    <Route path="logs" element={<PlatformLogs />} />
                    <Route path="settings" element={<PlatformSettings />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </FacilitatorProvider>
        </InstitutionProvider>
      </UserProgressProvider>
        </AlertProvider>
      </AuthLoader>
    </AuthProvider>
  );
}

export default App;
