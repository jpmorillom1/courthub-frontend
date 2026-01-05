import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './components/dashboard/Dashboard';
import { MasterSchedule } from './components/schedule/MasterSchedule';
import { BookingFlow } from './components/booking/BookingFlow';
import { MyReservations } from './components/reservations/MyReservations';
import { ReservationDetail } from './components/reservations/ReservationDetail';
import { ReportIssue } from './components/reports/ReportIssue';
import { AdminReports } from './components/reports/AdminReports';
import { UserList } from './components/admin/UserList';
import { AddManualBooking } from './components/admin/AddManualBooking';
import { UserProfile } from './components/user/UserProfile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes - no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App routes - with layout and protection */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Layout>
                  <MasterSchedule />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookingFlow />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyReservations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReservationDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/:id/report"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportIssue />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminReports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manual-booking"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddManualBooking />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
