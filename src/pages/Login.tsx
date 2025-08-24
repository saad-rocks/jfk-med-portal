import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Eye, EyeOff, Lock, Mail, Heart, GraduationCap } from "lucide-react";
import { auth } from "../firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({ text: "Welcome back! Redirecting to dashboard...", type: 'success' });
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (err: any) {
      setMessage({ 
        text: err.code === 'auth/invalid-credential' 
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
    } catch (e: any) {
      setMessage({ 
        text: e.code === 'auth/user-not-found' 
          ? "No account found with this email address"
          : "Could not send reset email. Please try again.",
        type: 'error' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 page-transition">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-teal-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="relative group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-glow interactive">
                J
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center pulse-vital">
                <Heart size={10} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 bg-clip-text text-transparent">
                JFK Medical Portal
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                <GraduationCap size={16} className="text-blue-500" />
                <span className="font-medium">Academic Excellence in Medicine</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">Welcome Back</h2>
            <p className="text-slate-600">Sign in to continue your medical education journey</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-glow glass backdrop-blur-md">
          <CardHeader className="pb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">Secure Sign In</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={onLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                    <Mail size={18} className="text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@jfkmedical.edu"
                    className="pl-12 h-12 border-2 border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300"
                    required
                    autoComplete="email"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 to-teal-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                    <Lock size={18} className="text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secure password"
                    className="pl-12 pr-12 h-12 border-2 border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-50 rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye size={18} className="text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 to-teal-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <button 
                  type="button" 
                  onClick={onReset} 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded px-2 py-1"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium backdrop-blur-sm animate-slide-down ${
                  message.type === 'error' 
                    ? 'bg-red-50/80 text-red-700 border border-red-200/50 shadow-soft' 
                    : 'bg-green-50/80 text-green-700 border border-green-200/50 shadow-soft'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      message.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                    <span>{message.text}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold shadow-glow rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed fab"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                  </div>
                )}
              </Button>

              {/* Additional Security Info */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-lg text-xs text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secured with 256-bit encryption</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <button className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:text-blue-600">
              Privacy Policy
            </button>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <button className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:text-blue-600">
              Terms of Service
            </button>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <button className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:text-blue-600">
              Support
            </button>
          </div>
          <div className="text-xs text-slate-400">
            <p>© 2024 JFK Medical Portal</p>
            <p className="mt-1">Empowering the next generation of healthcare professionals</p>
          </div>
        </div>
      </div>
    </div>
  );
}


