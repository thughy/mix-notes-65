
import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, User, Mail, KeyRound, Camera, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

export default function Account() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
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

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast.error("Please enter a new email address");
      return;
    }
    
    try {
      setIsUpdatingEmail(true);
      
      // Create the email update
      await user?.createEmailAddress({
        email: newEmail
      });
      
      // Send verification email
      await user?.prepareEmailAddressVerification({
        strategy: "email_code"
      });
      
      toast.success("Verification email sent to your new address");
      setNewEmail("");
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.errors?.[0]?.message || "Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      // Update password
      await user?.updatePassword({
        currentPassword,
        newPassword
      });
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.errors?.[0]?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    try {
      setIsUpdatingImage(true);
      
      // Upload the image to Clerk
      await user?.setProfileImage({
        file
      });
      
      toast.success("Profile picture updated successfully");
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast.error(error.errors?.[0]?.message || "Failed to upload profile picture");
    } finally {
      setIsUpdatingImage(false);
    }
  };

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
          <Card className="w-full md:w-1/3">
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 relative mb-4">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="rounded-full w-full h-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="rounded-full w-full h-full bg-blue-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-blue-500" />
                  </div>
                )}
              </div>
              <CardTitle>{user?.fullName || user?.username || "User"}</CardTitle>
              <CardDescription>{user?.primaryEmailAddress?.emailAddress}</CardDescription>
              <div className="mt-4">
                <input 
                  type="file" 
                  id="profileImage" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                <label htmlFor="profileImage">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={isUpdatingImage}
                    asChild
                  >
                    <span>
                      {isUpdatingImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Change Picture
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Email: </span>
                  <span className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Account created: </span>
                  <span className="text-muted-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>
              <Separator className="my-6" />
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
          
          {/* Settings Forms */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Email Update Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Update Email Address
                </CardTitle>
                <CardDescription>
                  Change the email address associated with your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="currentEmail">Current Email</Label>
                    <Input 
                      id="currentEmail" 
                      value={user?.primaryEmailAddress?.emailAddress || ""} 
                      disabled 
                      className="bg-slate-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newEmail">New Email</Label>
                    <Input 
                      id="newEmail" 
                      type="email" 
                      value={newEmail} 
                      onChange={(e) => setNewEmail(e.target.value)} 
                      placeholder="Enter new email address" 
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isUpdatingEmail}
                  >
                    {isUpdatingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Email"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Password Change Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      placeholder="Enter current password" 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Enter new password" 
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
