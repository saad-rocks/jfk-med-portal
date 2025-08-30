import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import type { MouseEvent } from "react";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed interactive relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-glow hover:shadow-glow/80",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 shadow-soft",
        ghost: "bg-transparent text-slate-600 hover:bg-white/50 hover:text-slate-800",
        outline: "border-2 border-slate-200 bg-white/50 text-slate-700 hover:bg-white hover:border-blue-300 hover:text-blue-600 backdrop-blur-sm",
        success: "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-glow",
        warning: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-soft",
        danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-soft",
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

export function Button({ className, variant, size, onClick, ...props }: Props) {
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
    {...buttonProps}
  />;
}


