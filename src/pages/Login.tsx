import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail, type AuthError } from "firebase/auth";
import { Eye, EyeOff, Lock, Mail, Heart, GraduationCap, UserPlus, X, Bell } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { createUser, updateUserLastLogin } from "../lib/users";
import type { Announcement, MDYear } from "../types";

type NoticeAnnouncement = {
  id: string;
  title: string;
  content: string;
  priority: Announcement["priority"];
  publishedAt?: number;
  authorName?: string | null;
  pinned?: boolean;
  expiresAt?: number | null;
};

const gradientByPriority: Record<Announcement["priority"], string> = {
  high: "from-red-50 to-red-100/80 border-red-200/60",
  medium: "from-blue-50 to-blue-100/80 border-blue-200/60",
  low: "from-emerald-50 to-emerald-100/80 border-emerald-200/60",
};

const priorityLabel: Record<Announcement["priority"], string> = {
  high: "Urgent",
  medium: "Update",
  low: "Info",
};

const priorityDot: Record<Announcement["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-blue-500",
  low: "bg-emerald-500",
};

const priorityBadge: Record<Announcement["priority"], string> = {
  high: "text-red-800 bg-red-100/80",
  medium: "text-blue-800 bg-blue-100/80",
  low: "text-emerald-800 bg-emerald-100/80",
};

const truncateText = (value: string, length = 180): string => {
  if (!value) return "";
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
};

const relativeTime = (value?: number): string => {
  if (!value) return "";
  const diff = Date.now() - value;
  const minutes = Math.round(Math.abs(diff) / (1000 * 60));
  if (minutes < 60) {
    return diff >= 0 ? `${minutes} min ago` : `in ${minutes} min`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return diff >= 0 ? `${hours} hr ago` : `in ${hours} hr`;
  }
  const days = Math.round(hours / 24);
  return diff >= 0 ? `${days} day${days === 1 ? "" : "s"} ago` : `in ${days} day${days === 1 ? "" : "s"}`;
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);

  // Sign up modal state
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student" as "student" | "teacher" | "admin",
    // Student fields
    mdYear: "MD-1" as MDYear,
    studentId: "",
    gpa: "",
    // Teacher fields
    department: "",
    specialization: "",
    employeeId: "",
    // Admin fields
    adminLevel: "regular" as "regular" | "super"
  });
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [loginAnnouncements, setLoginAnnouncements] = useState<NoticeAnnouncement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState<boolean>(true);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAnnouncements = async () => {
      try {
        setAnnouncementsLoading(true);
        setAnnouncementsError(null);

        const callable = httpsCallable(functions, "fetchAnnouncementsFeed");
        const response = await callable({ limit: 6, audience: "all", includeExpired: false });
        if (cancelled) return;

        const payload = response.data as any;
        if (payload?.ok && Array.isArray(payload.announcements)) {
          const mapped = payload.announcements.map((item: any): NoticeAnnouncement => ({
            id: item.id,
            title: item.title ?? "Announcement",
            content: item.content ?? "",
            priority: (item.priority ?? "medium") as Announcement["priority"],
            publishedAt: typeof item.publishedAt === "number" ? item.publishedAt : undefined,
            authorName: item.authorName ?? null,
            pinned: Boolean(item.pinned),
            expiresAt: typeof item.expiresAt === "number" ? item.expiresAt : null,
          }));
          setLoginAnnouncements(mapped);
        } else {
          setLoginAnnouncements([]);
        }
      } catch (error) {
        if (!cancelled) {
          setAnnouncementsError("Unable to load announcements at the moment.");
        }
      } finally {
        if (!cancelled) {
          setAnnouncementsLoading(false);
        }
      }
    };

    loadAnnouncements();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Try to authenticate first
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // Update last login
      try {
        await updateUserLastLogin(credential.user.uid);
      } catch (updateError) {
        // Ignore update errors
      }

      setMessage({ text: "Welcome back! Redirecting to dashboard...", type: 'success' });
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (err: unknown) {
      const authError = err as AuthError;

      // If authentication failed with user-not-found or invalid-credential,
      // check if they have a pending/rejected registration request
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential' || authError.code === 'auth/wrong-password') {
        try {
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const { db } = await import('../firebase');

          // Check for pending request
          const pendingRequestQuery = query(
            collection(db, 'registrationRequests'),
            where('email', '==', email),
            where('status', '==', 'pending')
          );
          const pendingRequests = await getDocs(pendingRequestQuery);

          if (!pendingRequests.empty) {
            setMessage({
              text: "Your registration request is pending admin approval. Please wait for approval before attempting to login.",
              type: 'error'
            });
            setLoading(false);
            return;
          }

          // Check for rejected request
          const rejectedRequestQuery = query(
            collection(db, 'registrationRequests'),
            where('email', '==', email),
            where('status', '==', 'rejected')
          );
          const rejectedRequests = await getDocs(rejectedRequestQuery);

          if (!rejectedRequests.empty) {
            const rejectedDoc = rejectedRequests.docs[0];
            const rejectionReason = rejectedDoc.data().rejectionReason || "No reason provided";
            setMessage({
              text: `Your registration request was rejected. Reason: ${rejectionReason}`,
              type: 'error'
            });
            setLoading(false);
            return;
          }
        } catch (firestoreError) {
          // If Firestore check fails, just show the regular error message
          console.error('Error checking registration requests:', firestoreError);
        }

        // No pending/rejected request found, show authentication error
        if (authError.code === 'auth/user-not-found') {
          setMessage({
            text: "No account found. Please request access first.",
            type: 'error'
          });
        } else {
          setMessage({
            text: "Invalid email or password. Please try again.",
            type: 'error'
          });
        }
      } else {
        // Other authentication errors
        setMessage({
          text: "Login failed. Please check your credentials.",
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    if (!email) {
      setMessage({ text: "Please enter your email address first", type: 'error' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ text: "Password reset email sent. Check your inbox!", type: 'success' });
    } catch (e: unknown) {
      const authError = e as AuthError;
      setMessage({
        text: authError.code === 'auth/user-not-found'
          ? "No account found with this email address"
          : "Could not send reset email. Please try again.",
        type: 'error'
      });
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);
    setSignUpMessage(null);

    try {
      // Validate required fields
      if (!signUpForm.name || !signUpForm.email || !signUpForm.password) {
        throw new Error("Name, email, and password are required");
      }

      if (signUpForm.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Don't allow admin registration via public form
      if (signUpForm.role === 'admin') {
        throw new Error("Admin accounts must be created by existing administrators");
      }

      // Prepare registration request data
      const requestData: any = {
        name: signUpForm.name,
        email: signUpForm.email,
        password: signUpForm.password,
        phone: signUpForm.phone || null,
        role: signUpForm.role
      };

      // Add role-specific fields
      if (signUpForm.role === 'student') {
        requestData.mdYear = signUpForm.mdYear;
        requestData.studentId = signUpForm.studentId || null;
        requestData.gpa = signUpForm.gpa || null;
      } else if (signUpForm.role === 'teacher') {
        requestData.department = signUpForm.department || null;
        requestData.specialization = signUpForm.specialization || null;
        requestData.employeeId = signUpForm.employeeId || null;
      }

      // Submit registration request via Cloud Function
      const callable = httpsCallable(functions, 'submitRegistrationRequest');
      const response = await callable(requestData);
      const data = response.data as any;

      if (data?.ok) {
        setSignUpMessage({
          text: data.message || 'Registration request submitted successfully! An administrator will review your request shortly. You will be able to login once your account is approved.',
          type: 'success'
        });

        // Close modal after successful submission
        setTimeout(() => {
          setShowSignUpModal(false);
          setSignUpMessage(null);
          // Reset form
          setSignUpForm({
            name: "",
            email: "",
            password: "",
            phone: "",
            role: "student",
            mdYear: "MD-1",
            studentId: "",
            gpa: "",
            department: "",
            specialization: "",
            employeeId: "",
            adminLevel: "regular"
          });
        }, 3000);
      } else {
        throw new Error("Failed to submit registration request");
      }

    } catch (error: any) {
      // Handle Firebase Function errors
      const errorMessage = error?.message || "Failed to submit request. Please try again.";
      setSignUpMessage({
        text: errorMessage,
        type: 'error'
      });
    } finally {
      setSignUpLoading(false);
    }
  };

  const updateSignUpForm = (field: string, value: string) => {
    setSignUpForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/30 relative overflow-hidden">
      {/* Full width top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-teal-500 z-10"></div>

      {/* Optimized Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Simplified gradient orbs - static for better performance */}
        <div className="absolute -top-1/2 -right-1/4 w-80 h-80 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/3 -left-1/4 w-64 h-64 bg-gradient-to-tr from-teal-100/15 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative h-full flex">
        {/* Left Side - Notice Board (70% width) */}
        <div className="hidden lg:flex lg:w-[70%] bg-gradient-to-br from-white/90 via-blue-50/30 to-teal-50/30 flex-col justify-center p-6 relative overflow-hidden border-r border-white/30">

          {/* Header Section with Logo and Text - Top Left aligned */}
          <div className="absolute top-6 left-6 flex items-start gap-4">
            <div className="relative">
              <img
                src="/jfk-logo.png"
                alt="JFK Medical Center Logo"
                className="h-16 w-16 object-cover rounded-full shadow-lg ring-2 ring-white/50 flex-shrink-0"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent leading-tight">
                JFK Medical Portal
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-2 font-medium">
                <GraduationCap size={18} className="text-blue-600" />
                <span>Excellence in Medical Education</span>
              </div>
            </div>
          </div>

          {/* Notice Board - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl h-[500px] bg-white/95 rounded-3xl p-6 shadow-xl border border-white/60 relative overflow-hidden">
              {/* Simplified notice board background */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-teal-500"></div>

              <div className="relative">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
                      <Bell size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Notice Board</h2>
                      <p className="text-sm text-slate-600">
                        {announcementsLoading
                          ? "Gathering announcements…"
                          : announcementsError
                          ? "Announcements unavailable right now"
                          : loginAnnouncements.length === 0
                          ? "No announcements posted yet"
                          : `${loginAnnouncements.length} announcement${loginAnnouncements.length === 1 ? "" : "s"} for you`}
                      </p>
                    </div>
                  </div>
                  {loginAnnouncements.some((item) => item.pinned) ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {loginAnnouncements.filter((item) => item.pinned).length} pinned
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3 h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {announcementsLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`announcement-skeleton-${index}`}
                        className="animate-pulse rounded-lg border border-slate-200/60 bg-slate-100/60 p-4 shadow-sm"
                      >
                        <div className="mb-3 h-3 w-24 rounded-full bg-slate-200" />
                        <div className="mb-2 h-4 w-3/4 rounded-full bg-slate-200" />
                        <div className="h-3 w-full rounded-full bg-slate-200" />
                      </div>
                    ))
                  ) : announcementsError ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-700">
                      {announcementsError}
                    </div>
                  ) : loginAnnouncements.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-xs text-slate-500">
                      Announcements will appear here once they are published.
                    </div>
                  ) : (
                    loginAnnouncements.map((announcement) => {
                      const gradient = gradientByPriority[announcement.priority] ?? gradientByPriority.medium;
                      const badgeClass = priorityBadge[announcement.priority] ?? priorityBadge.medium;
                      return (
                        <div
                          key={announcement.id}
                          className={`bg-gradient-to-r ${gradient} rounded-lg border p-4 shadow-sm transition hover:shadow-lg`}
                        >
                          <div className="flex items-start justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${priorityDot[announcement.priority]}`} />
                              <span className={`rounded-full px-2 py-1 font-semibold ${badgeClass}`}>
                                {announcement.pinned ? "Pinned" : priorityLabel[announcement.priority]}
                              </span>
                            </div>
                            <span className="rounded-md bg-white/80 px-2 py-1 font-medium text-slate-500">
                              {relativeTime(announcement.publishedAt)}
                            </span>
                          </div>
                          <h3 className="mt-2 text-sm font-bold text-slate-800">{announcement.title}</h3>
                          <p className="mt-2 text-xs leading-relaxed text-slate-700">
                            {truncateText(announcement.content)}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            {announcement.authorName ? <span>By {announcement.authorName}</span> : null}
                            {announcement.expiresAt ? (
                              <span>Expires {relativeTime(announcement.expiresAt)}</span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/50">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>
                        {announcementsLoading
                          ? "Refreshing notice board…"
                          : loginAnnouncements[0]?.publishedAt
                          ? `Last updated ${relativeTime(loginAnnouncements[0]?.publishedAt)}`
                          : "Awaiting first announcement"}
                      </span>
                    </div>
                    <div className="rounded-full border border-blue-200/60 bg-gradient-to-r from-blue-500/10 to-teal-500/10 px-3 py-1.5">
                      <span className="text-slate-700 font-semibold text-xs">
                        {announcementsLoading
                          ? "Loading…"
                          : `${loginAnnouncements.length} active announcement${loginAnnouncements.length === 1 ? "" : "s"}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form (30% width) */}
        <div className="flex-1 lg:w-[30%] flex flex-col justify-center items-center p-4 lg:p-6 relative">
          {/* Mobile Logo (visible on small screens) */}
          <div className="lg:hidden text-center mb-6">
            <div className="relative inline-block">
              <img
                src="/jfk-logo.png"
                alt="JFK Medical Center Logo"
                className="h-20 w-20 object-cover rounded-full shadow-lg mb-3 ring-2 ring-white/70"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-1 leading-tight">
              JFK Medical Portal
            </h1>
            <p className="text-slate-600 text-sm">Secure Access Portal</p>
          </div>

          {/* Simplified Login Form Card */}
          <Card className="w-full max-w-sm h-[500px] bg-white/95 border-0 shadow-xl relative overflow-hidden">
            {/* Simplified card background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-500"></div>
            <CardHeader className="pb-4 pt-6 text-center">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
                <p className="text-sm text-slate-600">Sign in to access your medical portal</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
            <form onSubmit={onLogin} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@jfk.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 pr-4 py-2.5 text-slate-700 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 py-2.5 text-slate-700 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

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
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>

              <div className="text-center space-y-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={loading}
                >
                  Forgot your password?
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowSignUpModal(true)}
                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Need an account? Request access
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/jfk-logo.png"
                    alt="JFK Medical Center Logo"
                    className="h-12 w-12 object-cover rounded-full shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Request Account Access</h3>
                    <p className="text-sm text-slate-600">Join the JFK Medical Education Community</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSignUpModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={onSignUp} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Basic Information</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Full Name *</label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpForm.name}
                        onChange={(e) => updateSignUpForm('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={signUpForm.email}
                        onChange={(e) => updateSignUpForm('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Password *</label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={signUpForm.password}
                        onChange={(e) => updateSignUpForm('password', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signUpForm.phone}
                        onChange={(e) => updateSignUpForm('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Account Type</h4>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Role *</label>
                    <select
                      value={signUpForm.role}
                      onChange={(e) => updateSignUpForm('role', e.target.value as "student" | "teacher")}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher / Faculty</option>
                    </select>
                  </div>
                </div>

                {/* Role-specific Fields */}
                {signUpForm.role === 'student' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Student Information</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">MD Year</label>
                        <select
                          value={signUpForm.mdYear}
                          onChange={(e) => updateSignUpForm('mdYear', e.target.value as MDYear)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          {Array.from({ length: 11 }, (_, i) => (
                            <option key={i} value={`MD-${i + 1}` as MDYear}>MD-{i + 1}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Student ID</label>
                        <Input
                          type="text"
                          placeholder="e.g., JFK2024001"
                          value={signUpForm.studentId}
                          onChange={(e) => updateSignUpForm('studentId', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">GPA</label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="4.0"
                          placeholder="e.g., 3.75"
                          value={signUpForm.gpa}
                          onChange={(e) => updateSignUpForm('gpa', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {signUpForm.role === 'teacher' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Teacher Information</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Department</label>
                        <select
                          value={signUpForm.department}
                          onChange={(e) => updateSignUpForm('department', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">Select Department</option>
                          <option value="Internal Medicine">Internal Medicine</option>
                          <option value="Surgery">Surgery</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                          <option value="Psychiatry">Psychiatry</option>
                          <option value="Emergency Medicine">Emergency Medicine</option>
                          <option value="Radiology">Radiology</option>
                          <option value="Pathology">Pathology</option>
                          <option value="Anesthesiology">Anesthesiology</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Specialization</label>
                        <Input
                          type="text"
                          placeholder="e.g., Cardiology, Orthopedics"
                          value={signUpForm.specialization}
                          onChange={(e) => updateSignUpForm('specialization', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Employee ID</label>
                      <Input
                        type="text"
                        placeholder="e.g., JFK-FAC-001"
                        value={signUpForm.employeeId}
                        onChange={(e) => updateSignUpForm('employeeId', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {signUpForm.role === 'admin' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Administrator Information</h4>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Admin Level</label>
                      <select
                        value={signUpForm.adminLevel}
                        onChange={(e) => updateSignUpForm('adminLevel', e.target.value as "regular" | "super")}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="regular">Regular Admin</option>
                        <option value="super">Super Admin</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Message */}
                {signUpMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    signUpMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {signUpMessage.text}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSignUpModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                    disabled={signUpLoading}
                  >
                    {signUpLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


