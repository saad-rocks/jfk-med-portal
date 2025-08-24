import { PageHeader } from "../components/layout/PageHeader";

export default function OSCE() {
  return (
    <div className="space-y-4">
      <PageHeader title="OSCE" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'OSCE' }]} />
      <div className="bg-white rounded-2xl border p-4">Dashboard cards and detail skeletons (placeholder).</div>
    </div>
  );
}


