import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TodoItemProps {
  id: string;
  title: string;
  content?: string | null;
  completed: boolean;
  onUpdate: () => void;
}

export const TodoItem = ({ id, title, content, completed, onUpdate }: TodoItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
        title: "Note deleted",
        description: "Your note has been removed.",
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

  const hasContent = content && content.trim().length > 0;

  return (
    <Card className="group shadow-card hover:shadow-soft transition-all duration-300 border-border hover:border-primary/30 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={completed}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
            className="mt-1 h-5 w-5 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-primary data-[state=checked]:to-accent shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-medium transition-all duration-300 break-words ${
                completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {title}
            </h3>
            {hasContent && !isExpanded && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">
                {content}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {hasContent && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 transition-all duration-300"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isUpdating}
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {hasContent && isExpanded && (
        <CardContent className="pt-0 animate-accordion-down">
          <div className="pl-8 pr-2">
            <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
