import { useState, useEffect, useTransition, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
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
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          toast({
            title: "Verification Email Sent!",
            description: "Please check your email and click the verification link to activate your account.",
          });
        } else {
          toast({
            title: "Account created!",
            description: "You can now start using the app.",
          });
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
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-150">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="transition-all duration-150">
            {isLogin ? "Sign in to access your todos" : "Sign up to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4" key={isLogin ? 'login' : 'signup'} autoComplete="on">
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  className="transition-all duration-200 focus:shadow-soft"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="transition-all duration-200 focus:shadow-soft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="transition-all duration-200 focus:shadow-soft"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-150 shadow-soft active:scale-[0.98]"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Sign Up"}
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
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
            <div>
              <a
                href="/admin-auth"
                className="text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                Admin? Sign in here
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
