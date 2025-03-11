
import { useState } from "react";
import { User as UserIcon, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

interface ProfileCardProps {
  user: ReturnType<typeof useUser>["user"];
  onSignOut: () => Promise<void>;
}

export function ProfileCard({ user, onSignOut }: ProfileCardProps) {
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    try {
      setIsUpdatingImage(true);
      
      // Upload the image to Clerk
      await user.setProfileImage({
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

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader className="text-center">
        <div className="mx-auto w-24 h-24 relative mb-4">
          {user.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="rounded-full w-full h-full object-cover border-2 border-blue-100"
            />
          ) : (
            <div className="rounded-full w-full h-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-blue-500" />
            </div>
          )}
        </div>
        <CardTitle>{user.fullName || user.username || "User"}</CardTitle>
        <CardDescription>{user.primaryEmailAddress?.emailAddress}</CardDescription>
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
            <span className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Account created: </span>
            <span className="text-muted-foreground">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
            </span>
          </div>
        </div>
        <Separator className="my-6" />
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={onSignOut}
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}
