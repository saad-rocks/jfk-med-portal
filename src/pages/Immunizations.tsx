import { PageHeader } from "../components/layout/PageHeader";

export default function Immunizations() {
  return (
    <div className="space-y-4">
      <PageHeader title="Immunizations" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Immunizations' }]} />
      <div className="bg-white rounded-2xl border p-4">Upload records and status (placeholder).</div>
    </div>
  );
}


