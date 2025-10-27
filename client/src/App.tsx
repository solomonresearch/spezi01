import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { Reporting } from './components/Reporting';
import { CaseGenerator } from './components/CaseGenerator';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting"
            element={
              <ProtectedRoute>
                <Reporting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/case-generator"
            element={
              <ProtectedRoute>
                <CaseGenerator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
