// src/components/ui/GovButton.jsx
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export function GovButton({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary-dark text-base hover:bg-accent-navy focus:ring-primary-dark",
    secondary: "bg-secondary text-base hover:bg-primary-light focus:ring-secondary",
    danger: "bg-danger text-base hover:bg-warning focus:ring-danger",
    outline:
      "border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-base focus:ring-primary-dark",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
