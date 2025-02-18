import React from "react";

interface AlertProps {
  variant: "destructive" | "info";
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant, children }) => {
  const variantClass =
    variant === "destructive"
      ? "bg-red-500 text-white"
      : "bg-blue-500 text-white";

  return (
    <div className={`w-full p-4 rounded-lg ${variantClass}`}>
      <strong>{children}</strong>
    </div>
  );
};
