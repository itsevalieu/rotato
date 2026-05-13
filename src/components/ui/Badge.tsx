interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
  className?: string;
}

export default function Badge({
  children,
  color,
  onClick,
  className = "",
}: BadgeProps) {
  const Component = onClick ? "button" : "span";
  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        transition-colors duration-200
        ${
          color
            ? ""
            : "bg-parchment text-soft-brown-light border border-warm-gray-light/30"
        }
        ${onClick ? "cursor-pointer hover:opacity-80" : ""}
        ${className}
      `}
      style={
        color
          ? {
              backgroundColor: `${color}20`,
              color: color,
              borderColor: `${color}40`,
              borderWidth: 1,
            }
          : undefined
      }
    >
      {children}
    </Component>
  );
}
