import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./store/authStore";
import { AuthInitializer } from "./store/AuthInitializer";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { OAuth2Callback } from "./components/auth/OAuth2Callback";
import { Register } from "./components/auth/Register";
import { Dashboard } from "./components/dashboard/Dashboard";
import { MasterSchedule } from "./components/schedule/MasterSchedule";
import { BookingFlow } from "./components/booking/BookingFlow";
import { MyReservations } from "./components/reservations/MyReservations";
import { ReservationDetail } from "./components/reservations/ReservationDetail";
import { ReportIssue } from "./components/reports/ReportIssue";
import { AdminReports } from "./components/reports/AdminReports";
import { UserList } from "./components/admin/UserList";
import { AddManualBooking } from "./components/admin/AddManualBooking";
import { UserProfile } from "./components/user/UserProfile";
import { NotificationsPage } from "./components/notifications/NotificationsPage";
import { PaymentSuccess } from "./components/booking/PaymentSuccess";
import { PaymentCancel } from "./components/booking/PaymentCancel";
import { userService } from "./services/userService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

function HomeRedirect() {
  const { user } = useAuth();
  const isAdmin = userService.isAdmin(user) || user?.role === "ADMIN";
  return <Navigate to={isAdmin ? "/dashboard" : "/booking"} replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <Router>
        <Routes>
          {/* Auth routes - no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/register" element={<Register />} />

          {/* App routes - with layout and protection */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeRedirect />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRoles={["ADMIN"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute requiredRoles={["ADMIN"]}>
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
              <ProtectedRoute requiredRoles={["ADMIN"]}>
                <Layout>
                  <AdminReports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRoles={["ADMIN"]}>
                <Layout>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manual-booking"
            element={
              <ProtectedRoute requiredRoles={["ADMIN"]}>
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
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Payment routes - no layout needed for better UX */}
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/cancel"
            element={
              <ProtectedRoute>
                <PaymentCancel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
