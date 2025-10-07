import { useRole } from "../hooks/useRole";
import { PageHeader } from "../components/layout/PageHeader";
import { StudentSettings } from "./settings/StudentSettings";
import { TeacherSettings } from "./settings/TeacherSettings";
import { AdminSettings } from "./settings/AdminSettings";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function Settings() {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-4">
        <PageHeader title="Settings" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Settings' }]} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You need to complete your profile setup before accessing settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderSettingsContent = () => {
    switch (role) {
      case 'student':
        return <StudentSettings />;
      case 'teacher':
        return <TeacherSettings />;
      case 'admin':
        return <AdminSettings />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Unknown Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your account role is not recognized. Please contact your administrator.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Settings' }]} />
      {renderSettingsContent()}
    </div>
  );
}


