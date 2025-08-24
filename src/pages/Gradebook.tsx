import { PageHeader } from "../components/layout/PageHeader";

export default function Gradebook() {
  return (
    <div className="space-y-4">
      <PageHeader title="Gradebook" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Gradebook' }]} />
      <div className="bg-white rounded-2xl border p-4">Weighted categories and editable cells (placeholder).</div>
    </div>
  );
}


