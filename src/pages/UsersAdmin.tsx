import { PageHeader } from "../components/layout/PageHeader";

export default function UsersAdmin() {
  return (
    <div className="space-y-4">
      <PageHeader title="Users" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Users' }]} />
      <div className="bg-white rounded-2xl border p-4">List, create/edit modal, role badges (placeholder).</div>
    </div>
  );
}


