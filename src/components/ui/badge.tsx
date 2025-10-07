import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sky-100 text-sky-800 border border-sky-200",
        success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        warning: "bg-amber-100 text-amber-800 border border-amber-200",
        error: "bg-red-100 text-red-800 border border-red-200",
        destructive: "bg-red-100 text-red-800 border border-red-200",
        secondary: "bg-slate-100 text-slate-800 border border-slate-200",
        outline: "border border-slate-300 text-slate-700 bg-white",
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


