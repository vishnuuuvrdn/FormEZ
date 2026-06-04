export const Skeleton = ({
  variant = "line", // 'line' | 'circle' | 'rectangle'
  width = "w-full",
  height = "h-4",
  className = "",
}) => {
  const baseStyles = "bg-border/60 animate-pulse shrink-0";

  const variants = {
    line: "rounded-full",
    circle: "rounded-full",
    rectangle: "rounded-2xl",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${width} ${height} ${className}`}
    />
  );
};

export default Skeleton;
