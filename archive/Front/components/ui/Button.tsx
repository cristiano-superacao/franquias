"use client";
import React from "react";

export type ButtonVariant = "brand" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export default function Button({ variant = "brand", className = "", isLoading, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded px-4 py-2 transition disabled:opacity-60 active:scale-95 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants: Record<ButtonVariant, string> = {
    brand: "bg-brand text-black hover:brightness-95 focus-visible:outline-[color:var(--color-brand)]",
    ghost: "bg-surface-900 text-white border border-gray-800 hover:bg-surface-850 focus-visible:outline-[color:var(--color-brand)]",
  };
  
  return (
    <button 
      className={`${base} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Carregando...
        </>
      ) : children}
    </button>
  );
}
