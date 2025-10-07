import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail, type AuthError } from "firebase/auth";
import { Eye, EyeOff, Lock, Mail, Heart, GraduationCap, UserPlus, X, Bell } from "lucide-react";
import { auth } from "../firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { createUser } from "../lib/users";
import type { MDYear } from "../types";

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

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({ text: "Welcome back! Redirecting to dashboard...", type: 'success' });
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (err: unknown) {
      const authError = err as AuthError;
      setMessage({ 
        text: authError.code === 'auth/invalid-credential' 
          ? "Invalid email or password. Please try again." 
          : "Login failed. Please check your credentials.",
        type: 'error' 
      });
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

      // Prepare user data based on role
      const userData = {
        name: signUpForm.name,
        email: signUpForm.email,
        password: signUpForm.password,
        phone: signUpForm.phone || undefined,
        role: signUpForm.role
      };

      // Add role-specific fields
      if (signUpForm.role === 'student') {
        Object.assign(userData, {
          mdYear: signUpForm.mdYear,
          studentId: signUpForm.studentId || undefined,
          gpa: signUpForm.gpa ? parseFloat(signUpForm.gpa) : undefined,
          enrollmentDate: new Date()
        });
      } else if (signUpForm.role === 'teacher') {
        Object.assign(userData, {
          department: signUpForm.department || undefined,
          specialization: signUpForm.specialization || undefined,
          employeeId: signUpForm.employeeId || undefined,
          hireDate: new Date()
        });
      } else if (signUpForm.role === 'admin') {
        Object.assign(userData, {
          adminLevel: signUpForm.adminLevel,
          permissions: signUpForm.adminLevel === 'super'
            ? ['user_management', 'system_admin', 'user_creation', 'course_management']
            : ['user_management', 'user_creation']
        });
      }

      console.log('Creating user with data:', userData);

      const newUser = await createUser(userData);

      setSignUpMessage({
        text: `Account created successfully! Welcome ${newUser.name}. You can now sign in.`,
        type: 'success'
      });

      // Close modal after successful creation
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
      }, 2000);

    } catch (error) {
      console.error('Sign up error:', error);
      setSignUpMessage({
        text: error instanceof Error ? error.message : "Failed to create account. Please try again.",
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
                    <Bell size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Notice Board</h2>
                    <p className="text-sm text-slate-600">Latest updates and announcements</p>
                  </div>
                </div>
              </div>

            {/* Announcements */}
            <div className="relative">
              <div className="space-y-3 h-80 overflow-y-auto pr-2 custom-scrollbar">
                {/* Announcement 1 */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/70 rounded-lg p-3 border border-blue-200/50 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-bold text-blue-800 bg-blue-100/70 px-2 py-1 rounded-full">System Update</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium bg-white/70 px-2 py-1 rounded-md">Today</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">Portal Performance Enhancement</h3>
                  <p className="text-xs text-slate-600">New optimizations have been deployed for faster loading and improved user experience.</p>
                </div>

                {/* Announcement 2 */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/70 rounded-lg p-3 border border-emerald-200/50 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-1 rounded-full">Academic</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium bg-white/70 px-2 py-1 rounded-md">2 days ago</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">New Clinical Rotation Schedule</h3>
                  <p className="text-xs text-slate-600">Updated clinical rotation schedules for Spring 2025 semester are now available in your dashboard.</p>
                </div>

                {/* Announcement 3 */}
                <div className="bg-gradient-to-r from-amber-50 to-amber-100/70 rounded-lg p-3 border border-amber-200/50 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-1 rounded-full">Reminder</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium bg-white/70 px-2 py-1 rounded-md">3 days ago</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">Assignment Submission Deadline</h3>
                  <p className="text-xs text-slate-600">Clinical Assessment submissions are due by February 15th. Submit early to avoid last-minute issues.</p>
                </div>

                {/* Announcement 4 */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100/70 rounded-lg p-3 border border-purple-200/50 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs font-bold text-purple-800 bg-purple-100/70 px-2 py-1 rounded-full">Event</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium bg-white/70 px-2 py-1 rounded-md">1 week ago</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">Medical Excellence Symposium</h3>
                  <p className="text-xs text-slate-600">Join us for the Annual Medical Excellence Symposium on March 10th featuring renowned healthcare professionals.</p>
                </div>
              </div>
            </div>

              {/* Footer */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/50">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Last updated: Today, 2:30 PM</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 px-3 py-1.5 rounded-full border border-blue-200/50">
                      <span className="text-slate-700 font-semibold text-xs">4 new announcements</span>
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
                      onChange={(e) => updateSignUpForm('role', e.target.value as "student" | "teacher" | "admin")}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
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


