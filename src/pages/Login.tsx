import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail, type AuthError } from "firebase/auth";
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
          <CardContent>
            <form onSubmit={onLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onReset}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2024 JFK Medical Portal. All rights reserved.</p>
          <p className="mt-1">Secure • Reliable • Professional</p>
        </div>
      </div>
    </div>
  );
}


