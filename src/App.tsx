import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/ProtectedRoute";

// Layouts
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Hairstyles from "./pages/Hairstyles";
import BookAppointment from "./pages/BookAppointment";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Client Pages
import ClientProfile from "./pages/client/Profile";
import ClientAppointments from "./pages/client/Appointments";
import ClientSettings from "./pages/client/Settings";
import ClientLoyalty from "./pages/client/Loyalty";
import ClientNotifications from "./pages/client/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminUsers from "./pages/admin/Users";
import AdminInquiries from "./pages/admin/Inquiries";
import AdminContent from "./pages/admin/Content";
import AdminAvailability from "./pages/admin/Availability";
import AdminReports from "./pages/admin/Reports";
import AdminMedia from "./pages/admin/Media";
import AdminProfile from "./pages/admin/Profile";
import AdminStaff from "./pages/admin/Staff";
import AdminCommissions from "./pages/admin/Commissions";
import AdminNotifications from "./pages/admin/Notifications";
import AdminLoyalty from "./pages/admin/LoyaltyManagement";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/hairstyles" element={<Hairstyles />} />
              <Route path="/book" element={<BookAppointment />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
              <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            </Route>

            {/* Client Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CLIENT']}><ClientLayout /></ProtectedRoute>}>
              <Route path="/client" element={<ClientProfile />} />
              <Route path="/client/appointments" element={<ClientAppointments />} />
              <Route path="/client/settings" element={<ClientSettings />} />
              <Route path="/client/loyalty" element={<ClientLoyalty />} />
              <Route path="/client/notifications" element={<ClientNotifications />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/availability" element={<AdminAvailability />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/media" element={<AdminMedia />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/staff" element={<AdminStaff />} />
              <Route path="/admin/commissions" element={<AdminCommissions />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/loyalty" element={<AdminLoyalty />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
