import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = "default",
}) => {
  const variantClass =
    variant === "destructive"
      ? "bg-red-600 text-white"
      : "bg-blue-600 text-white";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold ${variantClass} disabled:opacity-50`}
    >
      {children}
    </button>
  );
};
