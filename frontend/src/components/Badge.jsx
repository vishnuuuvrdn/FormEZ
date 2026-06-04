import { CATEGORY_LABELS } from "../utils/constants";

export const Badge = ({
  children,
  variant = "category", // 'category' | 'status'
  value = "",
  className = "",
}) => {
  const normalizedValue = String(value).toLowerCase().trim();

  // Fine-tuned colors mapping for both light mode and dark mode
  const categoryStyles = {
    identity: "bg-[#FDF4E9] text-[#9A4E1B] border-[#F8E3CD] dark:bg-[#251B12] dark:text-[#E89E62] dark:border-[#3D2C1B]",
    vehicle: "bg-[#EDF6EF] text-[#256030] border-[#D3EAD8] dark:bg-[#152319] dark:text-[#6BCB81] dark:border-[#223929]",
    property: "bg-[#F5F2EC] text-[#554C3F] border-[#E5DFD4] dark:bg-[#22201D] dark:text-[#C5BDB0] dark:border-[#383430]",
    education: "bg-surface-muted text-text-secondary border-border dark:bg-surface-muted dark:text-text-secondary dark:border-border",
    health: "bg-[#FBF1F1] text-[#A62B2B] border-[#F6D7D7] dark:bg-[#2C1515] dark:text-[#E86D6D] dark:border-[#4A2222]",
    other: "bg-surface-muted text-text-primary border-border dark:bg-surface-muted dark:text-text-primary dark:border-border",
  };

  const statusStyles = {
    true: "bg-[#EDF6EF] text-[#256030] border-[#D3EAD8] dark:bg-[#152319] dark:text-[#6BCB81] dark:border-[#223929]",
    active: "bg-[#EDF6EF] text-[#256030] border-[#D3EAD8] dark:bg-[#152319] dark:text-[#6BCB81] dark:border-[#223929]",
    false: "bg-[#FBF1F1] text-[#A62B2B] border-[#F6D7D7] dark:bg-[#2C1515] dark:text-[#E86D6D] dark:border-[#4A2222]",
    inactive: "bg-[#FBF1F1] text-[#A62B2B] border-[#F6D7D7] dark:bg-[#2C1515] dark:text-[#E86D6D] dark:border-[#4A2222]",
  };

  const label = variant === "category" ? CATEGORY_LABELS[normalizedValue] || children || value : children || value;

  const styleClass =
    variant === "category"
      ? categoryStyles[normalizedValue] || categoryStyles.other
      : statusStyles[normalizedValue] || "bg-surface-muted text-text-secondary border-border dark:bg-surface-muted dark:text-text-secondary dark:border-border";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styleClass} uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
