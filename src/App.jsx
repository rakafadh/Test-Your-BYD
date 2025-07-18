import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestDriveProvider } from './context/TestDriveContext';
import { ChargingProvider } from './context/ChargingContext';
import ErrorBoundary from './components/ErrorBoundary';
import TrackerLayout from './components/common/TrackerLayout';
import LandingPage from './pages/LandingPage';
import MultiToast from './components/MultiToast';

// Test Drive Components
import TestDriveDashboard from './components/testdrive/TestDriveDashboard';
import TestDriveForm from './components/testdrive/TestDriveForm';
import TestDriveList from './components/testdrive/TestDriveList';
import TestDriveSettings from './components/testdrive/TestDriveSettings';

// Charging Components
import ChargingDashboard from './components/charging/ChargingDashboard';
import ChargingForm from './components/charging/ChargingForm';
import ChargingList from './components/charging/ChargingList';
import ChargingSettings from './components/charging/ChargingSettings';

function App() {
  return (
    <ErrorBoundary>
      <TestDriveProvider>
        <ChargingProvider>
          <Router>
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Test Drive Routes */}
              <Route path="/testdrive/*" element={
                <TrackerLayout type="testdrive">
                  <Routes>
                    <Route path="/" element={<TestDriveDashboard />} />
                    <Route path="/add" element={<TestDriveForm />} />
                    <Route path="/list" element={<TestDriveList />} />
                    <Route path="/settings" element={<TestDriveSettings />} />
                  </Routes>
                </TrackerLayout>
              } />
              
              {/* Charging Routes */}
              <Route path="/charging/*" element={
                <TrackerLayout type="charging">
                  <Routes>
                    <Route path="/" element={<ChargingDashboard />} />
                    <Route path="/add" element={<ChargingForm />} />
                    <Route path="/list" element={<ChargingList />} />
                    <Route path="/settings" element={<ChargingSettings />} />
                  </Routes>
                </TrackerLayout>
              } />
            </Routes>
            <MultiToast />
          </Router>
        </ChargingProvider>
      </TestDriveProvider>
    </ErrorBoundary>
  );
}

export default App;
