import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AddTodo } from "@/components/AddTodo";
import { TodoItem } from "@/components/TodoItem";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

type FilterType = "all" | "active" | "completed";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [todos, setTodos] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchTodos = async () => {
    if (!user) return;

    try {
      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const isUserAdmin = roleData?.role === "admin";

      if (isUserAdmin) {
        // Admin: fetch all todos
        const { data: todosData, error: todosError } = await supabase
          .from("todos")
          .select("*")
          .order("created_at", { ascending: false });

        if (todosError) throw todosError;

        // Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, full_name");

        if (profilesError) throw profilesError;

        // Create a map of user_id to profile
        const profilesMap = new Map(
          profilesData?.map(p => [p.id, p]) || []
        );

        // Map the data to include user info
        const todosWithUsers = todosData?.map((todo: any) => {
          const profile = profilesMap.get(todo.user_id);
          return {
            ...todo,
            user_email: profile?.email || "Unknown User",
            user_name: profile?.full_name || null
          };
        });

        setTodos(todosWithUsers || []);
      } else {
        // Regular user: fetch only their todos
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTodos(data || []);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching todos",
        description: error.message,
      });
    }
  };

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      if (!error && data) {
        setIsAdmin(data.role === "admin");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTodos();
      checkAdminStatus();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 pb-safe">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {isAdmin ? "All Notes (Admin)" : "My Notes"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {stats.active} active, {stats.completed} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Add Todo - Hidden for admins */}
        {!isAdmin && <AddTodo onAdd={fetchTodos} />}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 bg-secondary/50 p-1">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft">
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft">
              Active ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft">
              Done ({stats.completed})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No notes here yet!</p>
              {!isAdmin && <p className="text-sm mt-2">Click above to create your first note.</p>}
              {isAdmin && <p className="text-sm mt-2">No user notes to display.</p>}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                title={todo.title}
                content={todo.content}
                completed={todo.completed}
                onUpdate={fetchTodos}
                userEmail={isAdmin ? todo.user_email : undefined}
                userName={isAdmin ? todo.user_name : undefined}
                isAdminView={isAdmin}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
