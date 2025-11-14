import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, text: "", color: "" };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 1) return { score, text: "Weak", color: "bg-destructive" };
    if (score <= 3) return { score, text: "Fair", color: "bg-amber-500" };
    if (score <= 4) return { score, text: "Good", color: "bg-blue-500" };
    return { score, text: "Strong", color: "bg-green-500" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < strength.score ? strength.color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium transition-colors duration-200", 
        strength.score <= 1 && "text-destructive",
        strength.score === 2 && "text-amber-500",
        strength.score === 3 && "text-amber-500",
        strength.score === 4 && "text-blue-500",
        strength.score === 5 && "text-green-500"
      )}>
        Password strength: {strength.text}
      </p>
    </div>
  );
};
