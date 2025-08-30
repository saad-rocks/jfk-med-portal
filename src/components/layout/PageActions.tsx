import React from "react";

export function PageActions({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  );
}


