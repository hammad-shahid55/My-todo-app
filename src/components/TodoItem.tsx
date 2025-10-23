import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  onUpdate: () => void;
}

export const TodoItem = ({ id, title, completed, onUpdate }: TodoItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) throw error;
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;
      onUpdate();
      toast({
        title: "Todo deleted",
        description: "Your todo has been removed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-card to-secondary/30 shadow-card hover:shadow-soft transition-all duration-300 border border-border">
      <Checkbox
        checked={completed}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="h-5 w-5 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-primary data-[state=checked]:to-accent"
      />
      <span
        className={`flex-1 text-base transition-all duration-300 ${
          completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isUpdating}
        className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
