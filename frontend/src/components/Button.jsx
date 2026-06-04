import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 min-h-[44px] px-4";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/15",
    secondary: "bg-surface-muted text-text-primary hover:bg-border border border-border",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-muted",
    danger: "bg-danger text-white hover:bg-opacity-90 shadow-sm shadow-danger/10",
  };

  const sizes = {
    sm: "text-xs py-1.5 px-3 min-h-[38px] rounded-lg",
    md: "text-sm py-2.5 px-4",
    lg: "text-base py-3.5 px-6 rounded-2xl",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin mr-2 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
