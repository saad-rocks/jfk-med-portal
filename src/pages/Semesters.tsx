import { PageHeader } from "../components/layout/PageHeader";

export default function Semesters() {
  return (
    <div className="space-y-4">
      <PageHeader title="Semesters" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Semesters' }]} />
      <div className="bg-white rounded-2xl border p-4">Overview, timeline, enrollment summary (placeholder).</div>
    </div>
  );
}


