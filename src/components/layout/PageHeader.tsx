import React from "react";
import { Link } from "react-router-dom";
import { useBreadcrumbs, type Crumb } from "./useBreadcrumbs";

export function PageHeader({ title, actions, breadcrumb }: { title: string; actions?: React.ReactNode; breadcrumb?: Array<Crumb> }) {
  const auto = useBreadcrumbs();
  const resolvedBreadcrumb = breadcrumb ?? auto;
  
  return (
    <div className="mb-4">
      {resolvedBreadcrumb && (
        <nav className="text-xs text-gray-500 mb-1">
          {resolvedBreadcrumb.map((b, i) => (
            <span key={i}>
              {b.to ? <Link className="hover:underline" to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
              {i < resolvedBreadcrumb.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-700">{title}</h1>
        {actions}
      </div>
    </div>
  );
}


