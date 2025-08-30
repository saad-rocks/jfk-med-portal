import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { GraduationCap, UserCheck, AlertCircle } from "lucide-react";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, role: userRole, refreshProfile } = useRole();
  const [name, setName] = useState(user?.displayName || "");
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(userRole || 'student');
  const [mdYear, setMdYear] = useState<'MD-1' | 'MD-2' | 'MD-3' | 'MD-4' | 'MD-5' | 'MD-6' | 'MD-7' | 'MD-8' | 'MD-9' | 'MD-10' | 'MD-11'>('MD-1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  // Update role when userRole changes
  React.useEffect(() => {
    if (userRole && userRole !== role) {
      setRole(userRole);
    }
  }, [userRole, role]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!name.trim()) {
      setMessage({ text: "Please enter your full name", type: 'error' });
      setLoading(false);
      return;
    }

    try {
      // Use the cloud function to create user profile
      const createProfileFn = httpsCallable(functions, 'createUserProfile');
      const result = await createProfileFn({
        name: name.trim(),
        role,
        mdYear: role === 'student' ? mdYear : undefined
      });

      const data = result.data as {
        ok: boolean;
        profileId?: string;
        message?: string;
        existing?: boolean
      };

      if (data.ok) {
        const successMessage = data.existing
          ? "Profile already exists! Redirecting to dashboard..."
          : "Profile created successfully! Redirecting to dashboard...";

        setMessage({ text: successMessage, type: 'success' });

        // Refresh the user profile data and then navigate
        setTimeout(() => {
          console.log("🔄 Refreshing user profile and redirecting...");
          refreshProfile();

          // Give a moment for the profile refresh to complete
          setTimeout(() => {
            console.log("🔄 Attempting navigation to dashboard...");
            navigate("/", { replace: true });

            // Fallback: If navigation doesn't work, force a page reload
            setTimeout(() => {
              if (window.location.pathname === '/profile-setup') {
                console.log("🔄 Navigation failed, forcing page reload...");
                window.location.href = '/';
              }
            }, 1000);
          }, 500);
        }, 1000);
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (error: any) {
      console.error("Profile setup error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        stack: error.stack
      });

      // More specific error messages
      let errorMessage = "Failed to create profile. Please try again.";

      if (error.message?.includes("already-exists")) {
        errorMessage = "Profile already exists. Please contact an administrator.";
      } else if (error.message?.includes("unauthenticated")) {
        errorMessage = "You must be logged in to create a profile.";
      } else if (error.message?.includes("permission-denied")) {
        errorMessage = "You don't have permission to create a profile.";
      } else if (error.message?.includes("invalid-argument")) {
        errorMessage = "Invalid information provided. Please check your input.";
      } else if (error.code === 'functions/cancelled') {
        errorMessage = "Request was cancelled. Please try again.";
      } else if (error.code === 'functions/not-found') {
        errorMessage = "Profile creation service is not available. Please try again later.";
      } else if (error.code === 'functions/unavailable') {
        errorMessage = "Service is temporarily unavailable. Please try again later.";
      } else if (error.code === 'functions/internal') {
        errorMessage = "Server error occurred. Please try again.";
      } else if (error.code === 'functions/failed-precondition') {
        errorMessage = "Invalid request. Please check your information and try again.";
      }

      setMessage({
        text: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Not Authenticated</h2>
          <p className="text-gray-600">Please log in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-glow">
              <UserCheck size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-slate-600">Tell us a bit about yourself to get started</p>
          </div>
        </div>

        {/* Profile Setup Form */}
        <Card className="border-0 shadow-glow glass backdrop-blur-md">
          <CardHeader className="pb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">Profile Setup</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-slate-700">
                  Role *
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'teacher' | 'admin')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="student">Medical Student</option>
                  <option value="teacher">Teacher/Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <label htmlFor="mdYear" className="text-sm font-medium text-slate-700">
                    MD Year *
                  </label>
                  <select
                    id="mdYear"
                    value={mdYear}
                    onChange={(e) => setMdYear(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i + 1} value={`MD-${i + 1}`}>
                        MD-{i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Profile...
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </Button>

              {/* Info message for existing users */}
              {user && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50/80 text-blue-700 border border-blue-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-500"></div>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Welcome back, {user.displayName || user.email}!</p>
                      <p>If you've already set up your profile, clicking "Complete Setup" will confirm your existing profile and redirect you to the dashboard.</p>
                    </div>
                  </div>
                </div>
              )}


            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2024 JFK Medical Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
