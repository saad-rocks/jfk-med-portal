import { PageHeader } from "../components/layout/PageHeader";

export default function Settings() {
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Settings' }]} />
      <div className="bg-white rounded-2xl border p-4">Profile, notifications, preferences (placeholder).</div>
    </div>
  );
}


