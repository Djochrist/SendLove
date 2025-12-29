import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  isLoading?: boolean;
}

export function PremiumButton({ 
  className, 
  variant = "primary", 
  isLoading, 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5 hover:text-primary/90",
  };

  return (
    <button
      className={cn(
        "relative px-8 py-3 rounded-full font-serif font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group",
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine effect for primary buttons */}
      {variant === "primary" && (
        <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}
