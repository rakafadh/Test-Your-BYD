import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestDriveProvider } from './context/TestDriveContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TestDriveForm from './components/TestDriveForm';
import CameraCapture from './components/CameraCapture';
import TestDriveList from './components/TestDriveList';
import Settings from './components/Settings';

function App() {
  return (
    <ErrorBoundary>
      <TestDriveProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<TestDriveForm />} />
              <Route path="/camera" element={<CameraCapture />} />
              <Route path="/list" element={<TestDriveList />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </TestDriveProvider>
    </ErrorBoundary>
  );
}

export default App;
