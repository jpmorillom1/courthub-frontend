import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";

export function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => {
      if (user?.role) return user.role === role;
      return userService.hasRole(user, role);
    });

    if (!hasRequiredRole) {
      return <Navigate to="/booking" replace />;
    }
  }

  return children;
}
