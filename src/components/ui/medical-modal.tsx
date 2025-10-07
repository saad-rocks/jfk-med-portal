import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface MedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-7xl mx-4'
};

export function MedicalModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  size = 'md',
  children,
  footer,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true
}: MedicalModalProps) {

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Force scroll to top when modal opens
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white/98 rounded-3xl shadow-soft border border-slate-200/60 w-full max-h-[95vh] overflow-hidden transform transition-transform duration-200 scale-100 animate-fade-in m-4",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-8 border-b border-slate-200/60">
            <div className="flex items-center gap-4">
              {icon && (
                <div className="p-3 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl shadow-soft">
                  {icon}
                </div>
              )}
              {title && (
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-sm text-slate-600 mt-1">{description}</p>
                  )}
                </div>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-3 hover:bg-slate-100/80 rounded-2xl transition-colors duration-150 interactive"
                aria-label="Close modal"
              >
                <X size={20} className="text-slate-500" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)] custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-4 p-8 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-blue-50/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience components for common modal patterns
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info'
}: ConfirmModalProps) {
  const variantStyles = {
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
    warning: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
    info: 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
  };

  return (
    <MedicalModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        <p className="text-slate-700 leading-relaxed">{message}</p>

        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "px-6 py-3 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all duration-200",
              variantStyles[variant]
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </MedicalModal>
  );
}

export default MedicalModal;
