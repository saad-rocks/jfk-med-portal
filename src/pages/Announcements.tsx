import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";

export default function Announcements() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Announcements"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Announcements' }]}
        actions={
          <PageActions>
            <Button variant="primary" onClick={() => alert('Open editor (placeholder)')}>New Announcement</Button>
          </PageActions>
        }
      />
      <div className="bg-white rounded-2xl border p-4">List and create editor (placeholder).</div>
    </div>
  );
}


