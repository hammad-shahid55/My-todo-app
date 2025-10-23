import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddTodoProps {
  onAdd: () => void;
}

export const AddTodo = ({ onAdd }: AddTodoProps) => {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAdding(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("todos").insert({
        title: title.trim(),
        user_id: user.id,
        completed: false,
      });

      if (error) throw error;

      setTitle("");
      onAdd();
      toast({
        title: "Todo added!",
        description: "Your new todo has been created.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        disabled={isAdding}
        className="flex-1 h-12 text-base transition-all duration-300 focus:shadow-soft"
      />
      <Button
        type="submit"
        disabled={isAdding || !title.trim()}
        className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-soft"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </form>
  );
};
