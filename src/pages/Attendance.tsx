import { PageHeader } from "../components/layout/PageHeader";

export default function Attendance() {
  return (
    <div className="space-y-4">
      <PageHeader title="Attendance" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Attendance' }]} />
      <div className="bg-white rounded-2xl border p-4">Session list and take/mark UI (placeholder).</div>
    </div>
  );
}


