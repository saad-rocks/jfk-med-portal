import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={clsx(
        "w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500",
        className
      )}
      {...rest}
    />
  );
}


