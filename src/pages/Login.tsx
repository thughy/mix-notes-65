
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { SlidersVertical, Loader2, Github, Mail, Apple } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    try {
      setIsSubmitting(true);
      
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        console.error("Login failed:", result);
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.errors?.[0]?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !email) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      setIsResettingPassword(true);
      
      await signIn.create({
        identifier: email,
        strategy: "reset_password_email_code",
      });
      
      toast.success("Password reset email sent. Please check your inbox.");
      
    } catch (err: any) {
      console.error("Password reset error:", err);
      toast.error(err.errors?.[0]?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSocialLogin = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    if (!isLoaded) return;
    
    try {
      const result = await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
      console.log("Social login initiated:", result);
    } catch (err: any) {
      console.error(`${strategy} login error:`, err);
      toast.error(err.errors?.[0]?.message || `Failed to login with ${strategy.replace('oauth_', '')}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-medium text-blue-700">
              <SlidersVertical className="h-6 w-6" />
              <span className="font-bold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>MIX NOTES</span>
            </Link>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
              Log in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Or{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin("oauth_google")}
                    className="h-11 w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h10" />
                      <path d="M12 2v10" />
                    </svg>
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin("oauth_facebook")}
                    className="h-11 w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    Facebook
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin("oauth_apple")}
                    className="h-11 w-full"
                  >
                    <Apple className="mr-2 h-4 w-4" />
                    Apple
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isResettingPassword}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                      {isResettingPassword ? "Sending..." : "Forgot password?"}
                    </button>
                  </div>
                  <div className="mt-1">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Mix Notes by Worship Sound Guy
        </div>
      </footer>
    </div>
  );
}

