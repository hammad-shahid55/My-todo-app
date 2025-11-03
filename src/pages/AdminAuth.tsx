import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCredential, setAdminCredential] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
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
        
        if (data.user) {
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="space-y-2 text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isLogin ? "Admin Login" : "Admin Registration"}
          </CardTitle>
          <CardDescription>
            {isLogin ? "Sign in with admin credentials" : "Create an admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-300 focus:shadow-soft"
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
                className="transition-all duration-300 focus:shadow-soft"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="adminCredential">Admin Credential *</Label>
                <Input
                  id="adminCredential"
                  type="password"
                  placeholder="Enter admin credential"
                  value={adminCredential}
                  onChange={(e) => setAdminCredential(e.target.value)}
                  required
                  className="transition-all duration-300 focus:shadow-soft"
                />
                <p className="text-xs text-muted-foreground">
                  Admin credential is required to create an admin account
                </p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-soft"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In as Admin" : "Create Admin Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm space-y-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-accent transition-colors duration-300"
            >
              {isLogin ? "Don't have an admin account? Register" : "Already have an admin account? Sign in"}
            </button>
            <div>
              <a
                href="/auth"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
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
