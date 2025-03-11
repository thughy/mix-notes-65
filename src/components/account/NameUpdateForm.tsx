
import { useState } from "react";
import { UserCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

interface NameUpdateFormProps {
  user: ReturnType<typeof useUser>["user"];
}

export function NameUpdateForm({ user }: NameUpdateFormProps) {
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdatingName(true);
      
      // According to Clerk's API documentation, we should use "first_name" and "last_name" for the raw API calls
      // But for the user.update method, we need to use "firstName" and "lastName"
      if (user) {
        await user.update({
          firstName,
          lastName,
        });
      }
      
      toast.success("Name updated successfully");
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast.error(error.errors?.[0]?.message || "Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Update Name
        </CardTitle>
        <CardDescription>
          Change your display name
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleNameUpdate} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              placeholder="Enter first name" 
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              placeholder="Enter last name" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={isUpdatingName}
          >
            {isUpdatingName ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Name"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
