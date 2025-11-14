import { useState, useEffect, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import { PasswordStrength } from "@/components/PasswordStrength";
import { signInSchema, adminSignUpSchema } from "@/lib/validations/auth";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCredential, setAdminCredential] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate inputs
    try {
      if (isLogin) {
        signInSchema.parse({ email, password });
      } else {
        adminSignUpSchema.parse({ email, password });
      }
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Check if email is verified
        if (data.user && !data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please verify your email before logging in. Check your inbox for the verification link.",
          });
          setLoading(false);
          return;
        }
        
        toast({
          title: "Welcome back, Admin!",
          description: "You've successfully logged in.",
        });
      } else {
        if (!adminCredential) {
          toast({
            variant: "destructive",
            title: "Admin Credential Required",
            description: "Please enter the admin credential to create an admin account.",
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) throw error;
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          toast({
            title: "Verification Email Sent!",
            description: "Please check your email and click the verification link. After verification, your admin role will be activated.",
          });
          
          // Try to assign admin role anyway (will be active after email verification)
          try {
            await supabase.functions.invoke('set-admin-role', {
              body: { userId: data.user.id, adminCredential }
            });
          } catch (roleError) {
            console.error("Error calling set-admin-role:", roleError);
          }
        } else if (data.user) {
          try {
            const { error: roleError } = await supabase.functions.invoke('set-admin-role', {
              body: { userId: data.user.id, adminCredential }
            });
            
            if (roleError) {
              console.error("Error assigning admin role:", roleError);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Admin role assignment failed. Please contact support.",
              });
            } else {
              toast({
                title: "Admin account created!",
                description: "You now have admin access to view all notes.",
              });
            }
          } catch (roleError) {
            console.error("Error calling set-admin-role:", roleError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to assign admin role.",
            });
          }
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-card transition-all duration-200">
        <CardHeader className="space-y-2 text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-150">
            {isLogin ? "Admin Login" : "Admin Registration"}
          </CardTitle>
          <CardDescription className="transition-all duration-150">
            {isLogin ? "Sign in with admin credentials" : "Create an admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4" key={isLogin ? 'login' : 'signup'} autoComplete="on">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: "" }));
                }}
                autoComplete="email"
                className={`transition-all duration-200 focus:shadow-soft ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: "" }));
                  }}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={`transition-all duration-200 focus:shadow-soft pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
              {!isLogin && <PasswordStrength password={password} />}
            </div>
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="adminCredential">Admin Credential *</Label>
                <Input
                  id="adminCredential"
                  type="password"
                  placeholder="Enter admin credential"
                  value={adminCredential}
                  onChange={(e) => setAdminCredential(e.target.value)}
                  required
                  autoComplete="off"
                  className="transition-all duration-200 focus:shadow-soft"
                />
                <p className="text-xs text-muted-foreground">
                  Admin credential is required to create an admin account
                </p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-150 shadow-soft active:scale-[0.98]"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In as Admin" : "Create Admin Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm space-y-2">
            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  setIsLogin(!isLogin);
                });
              }}
              className="text-primary hover:text-accent transition-colors duration-150 font-medium"
            >
              {isLogin ? "Don't have an admin account? Register" : "Already have an admin account? Sign in"}
            </button>
            <div>
              <a
                href="/auth"
                className="text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                Regular user? Sign in here
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
