import { Skeleton } from "@/components/ui/skeleton";

export const TodoListSkeleton = () => {
  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="bg-card p-4 rounded-lg border border-border shadow-sm animate-in fade-in slide-in-from-bottom-2" 
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
