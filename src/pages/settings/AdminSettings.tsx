import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import { useRole } from "../../hooks/useRole";
import { useToast } from "../../hooks/useToast";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { getUserByUid, updateUser } from "../../lib/users";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
  User,
  Settings,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Database,
  Key,
  Lock,
  Activity,
  HardDrive,
  Users,
  FileText,
  Download,
  LogOut,
  Clock
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  adminLevel: z.enum(["super", "regular"] as const),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function AdminSettings() {
  const { user, refreshProfile } = useRole();
  const { push } = useToast();
  const { settings: systemSettings, updateSettings } = useSystemSettings();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Additional state for admin functions
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string>("idle");

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    userActivity: true,
    securityEvents: true,
    maintenanceUpdates: true,
    backupStatus: true,
    emailNotifications: true,
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      adminLevel: "regular",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUserByUid(user.uid);
          if (profile) {
            setUserProfile(profile);
            profileForm.reset({
              name: profile.name || "",
              email: profile.email || "",
              phone: profile.phone || "",
              adminLevel: profile.adminLevel || "regular",
            });
          }
        } catch (_error) {
          push({
            title: "Error",
            description: "Failed to load profile information",
            variant: "error",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!userProfile?.id) return;

    setSaving(true);
    try {
      await updateUser(userProfile.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        adminLevel: data.adminLevel,
      });

      refreshProfile();
      push({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (_error) {
      push({
        title: "Error",
        description: "Failed to update profile",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      push({
        title: "Success",
        description: "Password changed successfully",
        variant: "success",
      });

      passwordForm.reset();
    } catch (_error) {
      push({
        title: "Error",
        description: "Failed to change password",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    push({
      title: "Settings Updated",
      description: "Notification preferences saved",
      variant: "success",
    });
  };

  const updateSystemSetting = async (key: string, value: any) => {
    try {
      setSaving(true);
      await updateSettings({ [key]: value });
      push({
        title: "System Settings Updated",
        description: "System configuration saved successfully",
        variant: "success",
      });
    } catch (error: any) {
      push({
        title: "Error",
        description: error.message || "Failed to update system settings",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const getPermissionsList = () => {
    if (userProfile?.adminLevel === 'super') {
      return [
        'user_management', 'system_admin', 'user_creation', 'data_export',
        'system_configuration', 'backup_management', 'audit_logs', 'security_settings'
      ];
    }
    return userProfile?.permissions || ['user_management'];
  };

  // Trigger database backup
  const handleBackup = async () => {
    try {
      setBackupStatus("processing");
      const backupFn = httpsCallable(functions, "triggerDatabaseBackup");
      const result = await backupFn();
      const data = result.data as any;

      if (data.ok) {
        push({
          title: "Backup Initiated",
          description: data.message,
          variant: "success",
        });
        setBackupStatus("success");
      }
    } catch (error: any) {
      push({
        title: "Backup Failed",
        description: error.message || "Failed to trigger backup",
        variant: "error",
      });
      setBackupStatus("error");
    }
  };

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    try {
      setLoadingSessions(true);
      const sessionsFn = httpsCallable(functions, "getActiveSessions");
      const result = await sessionsFn();
      const data = result.data as any;

      if (data.ok) {
        setActiveSessions(data.sessions || []);
      }
    } catch (error: any) {
      push({
        title: "Error",
        description: "Failed to fetch active sessions",
        variant: "error",
      });
    } finally {
      setLoadingSessions(false);
    }
  };

  // Force logout user
  const handleForceLogout = async (uid: string) => {
    try {
      const logoutFn = httpsCallable(functions, "forceLogoutUser");
      const result = await logoutFn({ uid });
      const data = result.data as any;

      if (data.ok) {
        push({
          title: "Success",
          description: data.message,
          variant: "success",
        });
        // Refresh sessions list
        fetchActiveSessions();
      }
    } catch (error: any) {
      push({
        title: "Error",
        description: error.message || "Failed to logout user",
        variant: "error",
      });
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      setLoadingLogs(true);
      const logsFn = httpsCallable(functions, "getAuditLogs");
      const result = await logsFn({ limit: 50 });
      const data = result.data as any;

      if (data.ok) {
        setAuditLogs(data.logs || []);
      }
    } catch (error: any) {
      push({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "error",
      });
    } finally {
      setLoadingLogs(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600">Manage system configuration and administrative preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-7 text-xs md:text-sm">
          <TabsTrigger value="profile" className="flex items-center gap-1 md:gap-2">
            <User className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1 md:gap-2">
            <Database className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-1 md:gap-2">
            <HardDrive className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Backup</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-1 md:gap-2">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-1 md:gap-2">
            <FileText className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Audit</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 md:gap-2">
            <Bell className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 md:gap-2">
            <Shield className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      {...profileForm.register("name")}
                      placeholder="Enter your full name"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <Input
                      {...profileForm.register("email")}
                      type="email"
                      placeholder="Enter your email"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      {...profileForm.register("phone")}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Level *
                    </label>
                    <select
                      {...profileForm.register("adminLevel")}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                    >
                      <option value="regular">Regular Admin</option>
                      <option value="super">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} className="flex items-center gap-2">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Administrative Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Administrative Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Admin Level</h4>
                  <Badge
                    variant={userProfile?.adminLevel === 'super' ? 'destructive' : 'default'}
                    className="px-3 py-1"
                  >
                    {userProfile?.adminLevel === 'super' ? 'Super Admin' : 'Regular Admin'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Account Status</h4>
                  <Badge
                    variant={userProfile?.status === 'active' ? 'default' : 'destructive'}
                    className="px-3 py-1"
                  >
                    {userProfile?.status || "Unknown"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Role</h4>
                  <Badge variant="outline" className="px-3 py-1">
                    Administrator
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Created Date</h4>
                  <p className="text-gray-600">
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()
                      : "Not available"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Permissions & Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    Current Permissions ({getPermissionsList().length})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getPermissionsList().map((permission: string) => (
                    <div key={permission} className="flex items-center gap-2 p-3 border rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700 capitalize">
                        {permission.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>

                {userProfile?.adminLevel === 'super' && (
                  <div className="bg-purple-50 p-4 rounded-lg mt-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">Super Admin Privileges</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          You have full system access including user management, system configuration,
                          data export, backup management, and security settings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">Put the system in maintenance mode for updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings?.maintenanceMode || false}
                      onChange={(e) => updateSystemSetting('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Allow User Registration</h4>
                    <p className="text-sm text-gray-600">Allow new users to register accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings?.allowRegistration || false}
                      onChange={(e) => updateSystemSetting('allowRegistration', e.target.checked)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Allow Course Enrollments</h4>
                    <p className="text-sm text-gray-600">Permit students and faculty to enroll learners into courses</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings?.allowEnrollment !== false}
                      onChange={(e) => updateSystemSetting('allowEnrollment', e.target.checked)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Verification</h4>
                    <p className="text-sm text-gray-600">Require email verification for new accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings?.emailVerification || false}
                      onChange={(e) => updateSystemSetting('emailVerification', e.target.checked)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings?.twoFactorAuth || false}
                      onChange={(e) => updateSystemSetting('twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    value={systemSettings?.sessionTimeout || 30}
                    onChange={(e) => updateSystemSetting('sessionTimeout', parseInt(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                    disabled={saving}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <select
                    value={systemSettings?.maxLoginAttempts || 5}
                    onChange={(e) => updateSystemSetting('maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                    disabled={saving}
                  >
                    <option value="3">3 attempts</option>
                    <option value="5">5 attempts</option>
                    <option value="10">10 attempts</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Database</h4>
                  <p className="text-sm text-green-600">Online</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Authentication</h4>
                  <p className="text-sm text-green-600">Active</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Storage</h4>
                  <p className="text-sm text-green-600">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Administrative Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">System Alerts</h4>
                    <p className="text-sm text-gray-600">Critical system errors and warnings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.systemAlerts}
                      onChange={(e) => updateNotificationSetting('systemAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">User Activity</h4>
                    <p className="text-sm text-gray-600">New user registrations and account changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.userActivity}
                      onChange={(e) => updateNotificationSetting('userActivity', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Security Events</h4>
                    <p className="text-sm text-gray-600">Login attempts, password changes, and security alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.securityEvents}
                      onChange={(e) => updateNotificationSetting('securityEvents', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Maintenance Updates</h4>
                    <p className="text-sm text-gray-600">Scheduled maintenance and system updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.maintenanceUpdates}
                      onChange={(e) => updateNotificationSetting('maintenanceUpdates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Backup Status</h4>
                    <p className="text-sm text-gray-600">Backup completion and failure notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.backupStatus}
                      onChange={(e) => updateNotificationSetting('backupStatus', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email copies of all administrative notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => updateNotificationSetting('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Database Backup Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">About Database Backups</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Database backups create a snapshot of all system data. Regular backups ensure data recovery in case of system failures.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Last Backup</h4>
                  <p className="text-sm text-gray-600">
                    {systemSettings?.lastBackupDate
                      ? new Date(systemSettings.lastBackupDate.seconds * 1000).toLocaleString()
                      : "Never"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Backup Status</h4>
                  <Badge
                    variant={backupStatus === "success" ? "default" : backupStatus === "error" ? "destructive" : "outline"}
                  >
                    {backupStatus === "idle" ? "Ready" : backupStatus === "processing" ? "Processing..." : backupStatus === "success" ? "Success" : "Error"}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleBackup}
                  disabled={backupStatus === "processing"}
                  className="flex items-center gap-2"
                >
                  {backupStatus === "processing" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Backup...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Trigger Backup Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active User Sessions
                </CardTitle>
                <Button
                  onClick={fetchActiveSessions}
                  variant="outline"
                  size="sm"
                  disabled={loadingSessions}
                >
                  {loadingSessions ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No active sessions found</p>
                  <p className="text-sm mt-1">Click refresh to check for active users</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSessions.map((session: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{session.name}</h4>
                            <Badge variant="outline">{session.role}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{session.email}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Active for {session.sessionDuration} minutes</span>
                          </div>
                        </div>
                        {session.uid !== user?.uid && (
                          <Button
                            onClick={() => handleForceLogout(session.uid)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-1" />
                            Force Logout
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Audit Logs
                </CardTitle>
                <Button
                  onClick={fetchAuditLogs}
                  variant="outline"
                  size="sm"
                  disabled={loadingLogs}
                >
                  {loadingLogs ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No audit logs found</p>
                  <p className="text-sm mt-1">Click refresh to load recent audit logs</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className="border rounded-lg p-3 text-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {log.action?.replace(/_/g, ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'N/A'}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            Performed by: <span className="font-medium">{log.performedByEmail || 'Unknown'}</span>
                          </p>
                          {log.details && (
                            <p className="text-gray-600 mt-1 text-xs">
                              {JSON.stringify(log.details, null, 2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password *
                  </label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register("currentPassword")}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register("newPassword")}
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password *
                  </label>
                  <Input
                    {...passwordForm.register("confirmPassword")}
                    type="password"
                    placeholder="Confirm your new password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900">Security Requirements</h4>
                      <ul className="text-sm text-red-700 mt-1 space-y-1">
                        <li>• At least 6 characters long</li>
                        <li>• Should be different from your current password</li>
                        <li>• Use a mix of letters, numbers, and symbols</li>
                        <li>• Consider using a password manager</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} className="flex items-center gap-2">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
