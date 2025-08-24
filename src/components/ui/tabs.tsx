import { useState } from "react";

export function Tabs({ tabs }: { tabs: Array<{ key: string; label: string; content: React.ReactNode }> }) {
  const [active, setActive] = useState(tabs[0]?.key);
  return (
    <div>
      <div className="flex gap-2 border-b">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActive(t.key)} className={`px-3 py-2 text-sm rounded-t-lg ${active === t.key ? 'bg-white border-x border-t' : 'hover:bg-gray-50'}`}>{t.label}</button>
        ))}
      </div>
      <div className="border rounded-b-lg p-4 bg-white">
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
}


