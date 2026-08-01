import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import EntranceDashboard from "./pages/entrance/EntranceDashboard";
import VerifyVehicle from "./pages/entrance/VerifyVehicle";
import RegisterStudent from "./pages/entrance/RegisterStudent";
import VisitorManagement from "./pages/entrance/VisitorManagement";
import ParkingDashboard from "./pages/parking/ParkingDashboard";
import QRScanner from "./pages/parking/QRScanner";
import ReportViolation from "./pages/parking/ReportViolation";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRequests from "./pages/admin/ManageRequests";
import ManageSlots from "./pages/admin/ManageSlots";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminVisitors from "./pages/admin/AdminVisitors";
import AdminViolations from "./pages/admin/AdminViolations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
      isAuthenticated ?
      <Navigate to={
      user?.role === 'student' ? '/student' :
      user?.role === 'entrance_security' ? '/entrance' :
      user?.role === 'parking_security' ? '/parking' : '/admin'
      } replace /> :
      <LoginPage />
      } />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />

      {/* Entrance Security */}
      <Route path="/entrance" element={<ProtectedRoute allowedRoles={['entrance_security']}><EntranceDashboard /></ProtectedRoute>} />
      <Route path="/entrance/verify" element={<ProtectedRoute allowedRoles={['entrance_security']}><VerifyVehicle /></ProtectedRoute>} />
      <Route path="/entrance/register" element={<ProtectedRoute allowedRoles={['entrance_security']}><RegisterStudent /></ProtectedRoute>} />
      <Route path="/entrance/visitors" element={<ProtectedRoute allowedRoles={['entrance_security']}><VisitorManagement /></ProtectedRoute>} />

      {/* Parking Security */}
      <Route path="/parking" element={<ProtectedRoute allowedRoles={['parking_security']}><ParkingDashboard /></ProtectedRoute>} />
      <Route path="/parking/scanner" element={<ProtectedRoute allowedRoles={['parking_security']}><QRScanner /></ProtectedRoute>} />
      <Route path="/parking/violations" element={<ProtectedRoute allowedRoles={['parking_security']}><ReportViolation /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['admin']}><ManageRequests /></ProtectedRoute>} />
      <Route path="/admin/slots" element={<ProtectedRoute allowedRoles={['admin']}><ManageSlots /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/visitors" element={<ProtectedRoute allowedRoles={['admin']}><AdminVisitors /></ProtectedRoute>} />
      <Route path="/admin/violations" element={<ProtectedRoute allowedRoles={['admin']}><AdminViolations /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>);

};

const App = () =>
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>;


export default App;