import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { HomePage } from "./pages/Home";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ExpenseList } from "./pages/ExpenseList";
import { DashboardLayout } from "./pages/DashboardLayout";
import { AuthProvider } from "./pages/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuditLogs } from "./pages/AuditLogs";
import "./App.css";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/expenses" replace /> : <HomePage />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/expenses" replace /> : <Login />}
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            <DashboardLayout>
              <ExpenseList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <AuditLogs />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/la" element={<DashboardLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
