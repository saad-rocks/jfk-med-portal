import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import type { MouseEvent } from "react";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed interactive relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40",
        secondary: "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40",
        ghost: "bg-transparent text-slate-600 hover:bg-sky-50 hover:text-sky-700",
        outline: "border-2 border-slate-200 bg-white/50 text-slate-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 backdrop-blur-sm",
        success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25",
        warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25",
        danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & { asChild?: boolean };

export function Button({ className, variant, size, onClick, type = "button", ...props }: Props) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick && !e.currentTarget.disabled) {
      onClick(e);
    }
  };

  // Filter out asChild prop to avoid React warnings
  const buttonProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => key !== 'asChild')
  ) as Omit<Props, 'asChild'>;

  return <button
    className={clsx(buttonStyles({ variant, size }), className)}
    onClick={handleClick}
    type={type}
    {...buttonProps}
  />;
}


