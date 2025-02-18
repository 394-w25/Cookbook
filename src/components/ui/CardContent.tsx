import React from "react";

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>{children}</div>
  );
};
