import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PINGate from './components/PINGate';
import { ToastProvider } from './components/Toast';

import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Candidates from './pages/Candidates';
import Pipeline from './pages/Pipeline';
import Screening from './pages/Screening';
import Interviews from './pages/Interviews';
import InterviewDetail from './pages/InterviewDetail';
import Offers from './pages/Offers';
import OfferDetail from './pages/OfferDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F7] text-gray-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PINGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <ToastProvider>
      <BrowserRouter basename="/test123ATS">
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/screening" element={<Screening />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/interviews/:id" element={<InterviewDetail />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers/:id" element={<OfferDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}
