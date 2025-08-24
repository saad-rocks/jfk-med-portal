import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const onLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage({ text: "Welcome back! Redirecting to dashboard...", type: 'success' });
            setTimeout(() => navigate("/", { replace: true }), 1000);
        }
        catch (err) {
            setMessage({
                text: err.code === 'auth/invalid-credential'
                    ? "Invalid email or password. Please try again."
                    : "Login failed. Please check your credentials.",
                type: 'error'
            });
        }
        finally {
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
        }
        catch (e) {
            setMessage({
                text: e.code === 'auth/user-not-found'
                    ? "No account found with this email address"
                    : "Could not send reset email. Please try again.",
                type: 'error'
            });
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 page-transition", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full blur-3xl" }), _jsx("div", { className: "absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-teal-100/20 to-transparent rounded-full blur-3xl" })] }), _jsxs("div", { className: "relative w-full max-w-md space-y-8 animate-slide-up", children: [_jsxs("div", { className: "text-center space-y-6", children: [_jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-glow interactive", children: "J" }), _jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center pulse-vital", children: _jsx(Heart, { size: 10, className: "text-white" }) }), _jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" })] }), _jsxs("div", { className: "text-left", children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 bg-clip-text text-transparent", children: "JFK Medical Portal" }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600 mt-1", children: [_jsx(GraduationCap, { size: 16, className: "text-blue-500" }), _jsx("span", { className: "font-medium", children: "Academic Excellence in Medicine" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-xl font-semibold text-slate-800", children: "Welcome Back" }), _jsx("p", { className: "text-slate-600", children: "Sign in to continue your medical education journey" })] })] }), _jsxs(Card, { className: "border-0 shadow-glow glass backdrop-blur-md", children: [_jsx(CardHeader, { className: "pb-6 text-center", children: _jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-sm font-medium text-slate-700", children: "Secure Sign In" })] }) }), _jsx(CardContent, { className: "space-y-6", children: _jsxs("form", { onSubmit: onLogin, className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-slate-700", children: "Email Address" }), _jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200", children: _jsx(Mail, { size: 18, className: "text-slate-400 group-focus-within:text-blue-500" }) }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your.email@jfkmedical.edu", className: "pl-12 h-12 border-2 border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", required: true, autoComplete: "email" }), _jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 to-teal-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-slate-700", children: "Password" }), _jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200", children: _jsx(Lock, { size: 18, className: "text-slate-400 group-focus-within:text-blue-500" }) }), _jsx(Input, { id: "password", type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your secure password", className: "pl-12 pr-12 h-12 border-2 border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", required: true, autoComplete: "current-password" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-50 rounded-r-xl transition-colors duration-200", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { size: 18, className: "text-slate-400 hover:text-slate-600 transition-colors" })) : (_jsx(Eye, { size: 18, className: "text-slate-400 hover:text-slate-600 transition-colors" })) }), _jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 to-teal-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" })] })] }), _jsx("div", { className: "flex items-center justify-end", children: _jsx("button", { type: "button", onClick: onReset, className: "text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded px-2 py-1", children: "Forgot your password?" }) }), message && (_jsx("div", { className: `p-4 rounded-xl text-sm font-medium backdrop-blur-sm animate-slide-down ${message.type === 'error'
                                                ? 'bg-red-50/80 text-red-700 border border-red-200/50 shadow-soft'
                                                : 'bg-green-50/80 text-green-700 border border-green-200/50 shadow-soft'}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-2 h-2 rounded-full mt-2 flex-shrink-0 ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}` }), _jsx("span", { children: message.text })] }) })), _jsx(Button, { type: "submit", disabled: loading, className: "w-full h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold shadow-glow rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed fab", children: loading ? (_jsxs("div", { className: "flex items-center justify-center gap-3", children: [_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }), _jsx("span", { children: "Signing you in..." })] })) : (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { children: "Sign In" }), _jsx("div", { className: "w-1 h-1 bg-white/60 rounded-full" })] })) }), _jsx("div", { className: "text-center", children: _jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-lg text-xs text-slate-600", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { children: "Secured with 256-bit encryption" })] }) })] }) })] }), _jsxs("div", { className: "text-center space-y-4", children: [_jsxs("div", { className: "flex items-center justify-center gap-6 text-xs text-slate-500", children: [_jsx("button", { className: "hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:text-blue-600", children: "Privacy Policy" }), _jsx("div", { className: "w-1 h-1 bg-slate-300 rounded-full" }), _jsx("button", { className: "hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:text-blue-600", children: "Terms of Service" }), _jsx("div", { className: "w-1 h-1 bg-slate-300 rounded-full" }), _jsx("button", { className: "hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:text-blue-600", children: "Support" })] }), _jsxs("div", { className: "text-xs text-slate-400", children: [_jsx("p", { children: "\u00A9 2024 JFK Medical Portal" }), _jsx("p", { className: "mt-1", children: "Empowering the next generation of healthcare professionals" })] })] })] })] }));
}
