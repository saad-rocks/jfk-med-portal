import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({
  children,
  defaultValue,
  value,
  onValueChange,
  tabs
}: {
  children?: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  tabs?: Array<{ key: string; label: string; content: ReactNode }>;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const currentValue = value ?? internalValue;
  const handleValueChange = onValueChange ?? setInternalValue;

  // Support legacy API with tabs array
  if (tabs && tabs.length > 0) {
    const activeTab = tabs.find(tab => tab.key === currentValue) || tabs[0];
    return (
      <div>
        <div className="flex gap-2 border-b">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleValueChange(tab.key)}
              className={`px-3 py-2 text-sm rounded-t-lg ${
                currentValue === tab.key ? 'bg-white border-x border-t' : 'hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="border rounded-b-lg p-4 bg-white">
          {activeTab?.content}
        </div>
      </div>
    );
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className="space-y-0">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={clsx(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.value !== value) return null;

  return (
    <div
      className={clsx(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
}


