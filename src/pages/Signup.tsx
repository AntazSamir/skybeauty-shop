import { useState } from "react";
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
            <span className="font-body text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

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
