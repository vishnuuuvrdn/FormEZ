export const Input = ({
  label,
  error,
  helperText,
  className = "",
  id,
  type = "text",
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={type}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-surface text-sm text-text-primary placeholder-text-secondary/50 focus:bg-surface transition-all duration-200 outline-none
            ${
              error
                ? "border-danger focus:ring-1 focus:ring-danger focus:border-danger"
                : "border-border focus:border-accent focus:ring-1 focus:ring-accent"
            }
          `}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs text-danger font-medium animate-fade-in">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-text-secondary leading-relaxed">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
