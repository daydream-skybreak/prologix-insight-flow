
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Logistics from "./pages/Logistics";
import Feedback from "./pages/Feedback";
import FeedbackAnalytics from "./pages/FeedbackAnalytics";
import Store from "./pages/Store";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DynamicMap from "@/components/logistics/MapPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/store" element={<Store />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/mapvisual" element={<DynamicMap />} />
          <Route path="/feedback-analytics" element={<FeedbackAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
