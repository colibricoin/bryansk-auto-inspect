import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Prices from "./pages/Prices";
import Booking from "./pages/Booking";
import Documents from "./pages/Documents";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminRequestDetail from "./pages/admin/AdminRequestDetail";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPrices from "./pages/admin/AdminPrices";
import AdminEmails from "./pages/admin/AdminEmails";
import AdminSeoLocations from "./pages/admin/AdminSeoLocations";
import TehosmotrBryansk from "./pages/TehosmotrBryansk";
import CenyTehosmotra from "./pages/CenyTehosmotra";
import DiagnosticheskayaKarta from "./pages/DiagnosticheskayaKarta";
import SeoLocationPage from "./pages/SeoLocationPage";
import DistrictsPage from "./pages/DistrictsPage";

const queryClient = new QueryClient();

const SEO_SLUGS = [
  "tehosmotr-bezhickiy-rayon",
  "tehosmotr-volodarskiy-rayon",
  "tehosmotr-sovetskiy-rayon",
  "tehosmotr-fokinskiy-rayon",
  "tehosmotr-bolshoe-polpino",
  "punkt-tehosmotra-bryansk",
  "tehosmotr-dlya-osago-bryansk",
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<AdminRequestDetail />} />
            <Route path="prices" element={<AdminPrices />} />
            <Route path="emails" element={<AdminEmails />} />
            <Route path="seo-locations" element={<AdminSeoLocations />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Public routes */}
          <Route
            path="*"
            element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/prices" element={<Prices />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/tehosmotr-bryansk" element={<TehosmotrBryansk />} />
                    <Route path="/ceny-tehosmotra-bryansk" element={<CenyTehosmotra />} />
                    <Route path="/diagnosticheskaya-karta-bryansk" element={<DiagnosticheskayaKarta />} />
                    <Route path="/rayony-bryanska" element={<DistrictsPage />} />
                    {/* Dynamic SEO location pages */}
                    <Route path="/:slug" element={<SeoLocationPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
