import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import FacilitatorLayout from './layouts/FacilitatorLayout';
import FacilitatorDashboard from './pages/FacilitatorDashboard';
import InstitutionAdminLayout from './layouts/InstitutionAdminLayout';
import InstitutionAdminDashboard from './pages/InstitutionAdminDashboard';
import PlatformAdminLayout from './layouts/PlatformAdminLayout';
import PlatformAdminDashboard from './pages/PlatformAdminDashboard';
import TypingTest from './pages/TypingTest';
import StudentResults from './pages/StudentResults';
import FacilitatorTestLaunch from './pages/FacilitatorTestLaunch';
import InstitutionSettings from './pages/InstitutionSettings';
import InstitutionIntakes from './pages/InstitutionIntakes';
import InstitutionFacilitators from './pages/InstitutionFacilitators';
import InstitutionAnalytics from './pages/InstitutionAnalytics';
import InstitutionReports from './pages/InstitutionReports';
import Login from './pages/Login';

import { UserProgressProvider } from './context/UserProgressContext';
import { FacilitatorProvider } from './context/FacilitatorContext';
import { InstitutionProvider } from './context/InstitutionContext';
import StudentHistory from './pages/StudentHistory';
import StudentPractice from './pages/StudentPractice';

import FacilitatorClasses from './pages/FacilitatorClasses';
import FacilitatorReports from './pages/FacilitatorReports';
import FacilitatorSettings from './pages/FacilitatorSettings';
import FacilitatorAnalytics from './pages/FacilitatorAnalytics';

function App() {
  return (
    <UserProgressProvider>
      <InstitutionProvider>
        <FacilitatorProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/test" element={<TypingTest />} />
              <Route path="/" element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="results" element={<StudentResults />} />
                <Route path="practice" element={<StudentPractice />} />
                <Route path="history" element={<StudentHistory />} />
              </Route>
              <Route path="/facilitator" element={<FacilitatorLayout />}>
                <Route index element={<FacilitatorDashboard />} />
                <Route path="launch" element={<FacilitatorTestLaunch />} />
                <Route path="classes" element={<FacilitatorClasses />} />
                <Route path="analytics" element={<FacilitatorAnalytics />} />
                <Route path="reports" element={<FacilitatorReports />} />
                <Route path="settings" element={<FacilitatorSettings />} />
              </Route>
              <Route path="/admin" element={<InstitutionAdminLayout />}>
                <Route index element={<InstitutionAdminDashboard />} />
                <Route path="intakes" element={<InstitutionIntakes />} />
                <Route path="facilitators" element={<InstitutionFacilitators />} />
                <Route path="analytics" element={<InstitutionAnalytics />} />
                <Route path="reports" element={<InstitutionReports />} />
                <Route path="settings" element={<InstitutionSettings />} />
              </Route>
              <Route path="/super-admin" element={<PlatformAdminLayout />}>
                <Route index element={<PlatformAdminDashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FacilitatorProvider>
      </InstitutionProvider>
    </UserProgressProvider>
  );
}

export default App;
