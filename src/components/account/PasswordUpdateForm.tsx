
import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { UserResource } from "@clerk/clerk-react";

interface PasswordUpdateFormProps {
  user: UserResource;
}

export function PasswordUpdateForm({ user }: PasswordUpdateFormProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  return (
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
  );
}
