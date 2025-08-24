import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-blue-800 border border-blue-200",
        success: "bg-green-100 text-green-800 border border-green-200",
        warning: "bg-orange-100 text-orange-800 border border-orange-200",
        error: "bg-red-100 text-red-800 border border-red-200",
        secondary: "bg-gray-100 text-gray-800 border border-gray-200",
        outline: "border border-gray-300 text-gray-700 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={clsx(badgeVariants({ variant }), className)} {...props} />;
}


