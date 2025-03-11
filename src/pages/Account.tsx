
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { ProfileCard } from "@/components/account/ProfileCard";
import { NameUpdateForm } from "@/components/account/NameUpdateForm";
import { EmailUpdateForm } from "@/components/account/EmailUpdateForm"; 
import { PasswordUpdateForm } from "@/components/account/PasswordUpdateForm";

export default function Account() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 mt-20">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Overview */}
          <ProfileCard user={user!} onSignOut={handleSignOut} />
          
          {/* Settings Forms */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Name Update Form */}
            <NameUpdateForm user={user!} />
            
            {/* Email Update Form */}
            <EmailUpdateForm user={user!} />
            
            {/* Password Change Form */}
            <PasswordUpdateForm user={user!} />
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Mix Notes by Worship Sound Guy
        </div>
      </footer>
    </div>
  );
}
