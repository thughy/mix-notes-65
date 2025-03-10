
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl shadow-soft border border-slate-200">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <span className="text-5xl font-bold text-blue-600">4</span>
          <span className="text-5xl font-bold text-blue-400">0</span>
          <span className="text-5xl font-bold text-blue-600">4</span>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800">Page Not Found</h1>
        
        <p className="text-slate-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="flex items-center justify-center"
          >
            <Home className="mr-1 h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
