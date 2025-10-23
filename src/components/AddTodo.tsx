import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface AddTodoProps {
  onAdd: () => void;
}

export const AddTodo = ({ onAdd }: AddTodoProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
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
        content: content.trim() || null,
        user_id: user.id,
        completed: false,
      });

      if (error) throw error;

      setTitle("");
      setContent("");
      setIsExpanded(false);
      onAdd();
      toast({
        title: "Note added!",
        description: "Your new note has been created.",
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

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300 text-left text-muted-foreground hover:text-foreground"
      >
        <Plus className="inline h-5 w-5 mr-2" />
        Add a new note...
      </button>
    );
  }

  return (
    <Card className="shadow-card border-primary/20 animate-scale-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              disabled={isAdding}
              autoFocus
              className="text-base transition-all duration-300 focus:shadow-soft"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add more details..."
              disabled={isAdding}
              rows={4}
              className="resize-none text-base transition-all duration-300 focus:shadow-soft"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isAdding || !title.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isAdding}
              className="transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
