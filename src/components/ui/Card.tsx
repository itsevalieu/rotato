"use client";

import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: string;
  hoverable?: boolean;
}

export default function Card({
  accentColor,
  hoverable = true,
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        relative bg-white/80 dark:bg-white/[0.06] backdrop-blur-sm rounded-2xl
        shadow-warm-sm border border-warm-gray-light/30
        ${hoverable ? "hover:shadow-warm transition-shadow duration-300" : ""}
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {accentColor && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <div className={accentColor ? "pl-4" : ""}>{children}</div>
    </div>
  );
}
