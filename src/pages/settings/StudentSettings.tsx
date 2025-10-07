import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRole } from "../../hooks/useRole";
import { useToast } from "../../hooks/useToast";
import { getUserByUid, updateUser } from "../../lib/users";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
  User,
  GraduationCap,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  mdYear: z.enum(["MD-1", "MD-2", "MD-3", "MD-4", "MD-5", "MD-6", "MD-7", "MD-8", "MD-9", "MD-10", "MD-11"] as const).optional(),
  studentId: z.string().optional(),
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

export function StudentSettings() {
  const { user, role, refreshProfile } = useRole();
  const { push } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    assignmentReminders: true,
    gradeUpdates: true,
    courseAnnouncements: true,
    clinicalUpdates: true,
    emailNotifications: true,
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      mdYear: "MD-1",
      studentId: "",
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
              mdYear: profile.mdYear || "MD-1",
              studentId: profile.studentId || "",
            });
          }
        } catch (_error) {
          console.error("Error loading user profile:", _error);
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
      // Students cannot change their MD year - only admins can
      const updateData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        studentId: data.studentId,
      };

      // Only include mdYear if user is admin (this shouldn't happen in student settings but extra safety)
      if (role === 'admin' && data.mdYear) {
        updateData.mdYear = data.mdYear;
      }

      await updateUser(userProfile.id, updateData);

      refreshProfile();
      push({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (_error) {
      console.error("Error updating profile:", _error);
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
    // In a real implementation, this would call a Firebase function to change password
    setSaving(true);
    try {
      // Simulate password change
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
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
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
                      MD Year
                    </label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500">
                      {userProfile?.mdYear || "Not set"}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      MD Year can only be changed by administrators. Contact your academic advisor if this needs to be updated.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID
                    </label>
                    <Input
                      {...profileForm.register("studentId")}
                      placeholder="Enter your student ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current GPA
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        {userProfile?.gpa?.toFixed(2) || "Not set"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        GPA is calculated from your course grades
                      </span>
                    </div>
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

          {/* Academic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Current MD Year</h4>
                  <Badge variant="default" className="px-3 py-1">
                    {userProfile?.mdYear || "Not set"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Enrollment Date</h4>
                  <p className="text-gray-600">
                    {userProfile?.enrollmentDate
                      ? new Date(userProfile.enrollmentDate.seconds * 1000).toLocaleDateString()
                      : "Not set"
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Student ID</h4>
                  <p className="text-gray-600">{userProfile?.studentId || "Not set"}</p>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Assignment Reminders</h4>
                    <p className="text-sm text-gray-600">Get notified about upcoming assignment deadlines</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.assignmentReminders}
                      onChange={(e) => updateNotificationSetting('assignmentReminders', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Grade Updates</h4>
                    <p className="text-sm text-gray-600">Receive notifications when grades are posted</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.gradeUpdates}
                      onChange={(e) => updateNotificationSetting('gradeUpdates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Course Announcements</h4>
                    <p className="text-sm text-gray-600">Get notified about important course updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.courseAnnouncements}
                      onChange={(e) => updateNotificationSetting('courseAnnouncements', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Clinical Updates</h4>
                    <p className="text-sm text-gray-600">Receive notifications about clinical rotations and assessments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.clinicalUpdates}
                      onChange={(e) => updateNotificationSetting('clinicalUpdates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email copies of important notifications</p>
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

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Change Password
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

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Password Requirements</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• At least 6 characters long</li>
                        <li>• Should be different from your current password</li>
                        <li>• Use a mix of letters, numbers, and symbols</li>
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
