
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Index from "./pages/Index";
import NewMixEntry from "./pages/NewMixEntry";
import EditMixEntry from "./pages/EditMixEntry";
import CompareMixes from "./pages/CompareMixes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Root component that checks authentication status
const Root = () => {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Root />} />
          <Route 
            path="/new" 
            element={<ProtectedRoute><NewMixEntry /></ProtectedRoute>} 
          />
          <Route 
            path="/edit/:id" 
            element={<ProtectedRoute><EditMixEntry /></ProtectedRoute>} 
          />
          <Route 
            path="/progress" 
            element={<ProtectedRoute><CompareMixes /></ProtectedRoute>} 
          />
          <Route 
            path="/account" 
            element={<ProtectedRoute><Account /></ProtectedRoute>} 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
