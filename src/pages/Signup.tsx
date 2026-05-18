import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle Google/Social Login Callback from WordPress
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("access_token") || params.get("jwt");
    const emailParam = params.get("email") || params.get("user_email");
    const nameParam = params.get("display_name") || params.get("name") || params.get("user_nicename");

    if (token) {
      try {
        localStorage.setItem("wc_jwt", token);
        
        const authUser = {
          id: 0,
          token: token,
          email: emailParam || "",
          displayName: nameParam || "Google User",
          firstName: nameParam?.split(" ")[0] || "Google",
          lastName: nameParam?.split(" ").slice(1).join(" ") || "User",
          avatarUrl: "",
        };
        
        localStorage.setItem("wc_user", JSON.stringify(authUser));
        
        toast({
          title: "Welcome!",
          description: "You have signed in with Google successfully.",
        });
        
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } catch (err) {
        setError("Failed to complete Google sign-in. Please try again.");
      }
    }
  }, [toast]);

  const handleGoogleSignIn = () => {
    const baseWcUrl = import.meta.env.VITE_WC_URL || import.meta.env.VITE_WC_BASE_URL || "https://cms.skyebd.xyz";
    // Using root endpoint /?loginSocial=google is much more robust for headless sites as it bypasses wp-login.php security blocks
    const googleLoginUrl = `${baseWcUrl}/?loginSocial=google&redirect=${encodeURIComponent(window.location.origin + "/login")}`;
    
    toast({
      title: "Redirecting...",
      description: "Redirecting to Google for secure sign-in.",
    });
    
    window.location.href = googleLoginUrl;
  };

  const passwordStrong = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!passwordStrong) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await register(email, password, firstName, lastName);
      toast({
        title: "Account created!",
        description: "Welcome to SkyBD. You're now signed in.",
      });
      navigate("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-3xl font-bold text-foreground">
              SkyBD
            </Link>
            <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
              Create your account
            </h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Join thousands of skincare enthusiasts
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive font-body">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-body text-sm">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 font-body"
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-body text-sm">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="font-body"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-sm">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-body"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 font-body"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className={`flex items-center gap-1.5 text-xs font-body ${passwordStrong ? "text-green-600" : "text-amber-500"}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {passwordStrong ? "Strong password" : "Password too short (min 8 chars)"}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full font-body h-11" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Create Account"}
            </Button>

            <p className="font-body text-[11px] text-muted-foreground text-center">
              By creating an account you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-body text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full font-body h-11 flex items-center justify-center gap-3 border-border hover:bg-muted/50 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] mb-6"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-center font-body text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
