import { PageHeader } from "../components/layout/PageHeader";

export default function ClinicalRotations() {
  return (
    <div className="space-y-4">
      <PageHeader title="Clinical Rotations" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Clinical' }]} />
      <div className="bg-white rounded-2xl border p-4">Tables and detail page skeletons (placeholder).</div>
    </div>
  );
}


