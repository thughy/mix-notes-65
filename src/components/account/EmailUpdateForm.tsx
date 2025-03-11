
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

interface EmailUpdateFormProps {
  user: ReturnType<typeof useUser>["user"];
}

export function EmailUpdateForm({ user }: EmailUpdateFormProps) {
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast.error("Please enter a new email address");
      return;
    }
    
    try {
      setIsUpdatingEmail(true);
      
      // Create the email update
      const emailAddress = await user?.createEmailAddress({
        email: newEmail
      });
      
      // Request verification using the proper method
      if (emailAddress) {
        await emailAddress.prepareVerification({
          strategy: "email_code"
        });
        
        toast.success("Verification email sent to your new address");
        setNewEmail("");
      }
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.errors?.[0]?.message || "Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
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
  );
}
