import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useIsMobile } from "../utils/useIsMobile";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  const modalRef = useRef(null);
  const triggerElementRef = useRef(null);
  const isMobile = useIsMobile();

  // Handle Focus Trapping and Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Cache the opening element to return focus to on close
    triggerElementRef.current = document.activeElement;

    const modal = modalRef.current;
    if (modal) {
      // Find the first focusable item and focus it
      const focusables = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modal) {
        const focusables = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: Wrap around from first to last
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab: Wrap around from last to first
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Lock scroll on background body
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      // Restore focus to opening element
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card / mobile bottom-drawer container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`bg-surface shadow-2xl relative w-full md:max-w-md z-10 overflow-hidden transition-all duration-300 border border-border
          ${
            isMobile
              ? "rounded-t-2xl max-h-[92vh] animate-slide-up pb-8"
              : "rounded-2xl max-h-[85vh] animate-scale-up"
          }
          ${className}
        `}
      >
        {/* Drag handle for mobile only */}
        {isMobile && (
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-border rounded-full" />
          </div>
        )}

        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          {title && (
            <h3
              id="modal-title"
              className="text-lg font-serif font-bold text-text-primary leading-tight"
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-all duration-150 p-2 rounded-full cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content container */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(75vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
