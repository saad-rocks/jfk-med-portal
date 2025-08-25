import { Menu, Bell, Search, Settings, LogOut, Home, BookOpen, ClipboardList, GraduationCap, Users, Layers, CalendarCheck, FileText, Sun, User, Stethoscope, Heart, UserCheck, Calendar } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, ToastProvider } from "../components/ui/toast";
import { useRole } from "../hooks/useRole";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, role, mdYear } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log role for troubleshooting
  console.log('🔧 AppShell - Current role:', role, 'User email:', user?.email);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ToastProvider>
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-teal-50/20 page-transition">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button 
                className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-200 lg:hidden focus-ring interactive"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <Menu size={20} className="text-slate-600" />
              </button>
              
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-glow group-hover:shadow-glow transition-all duration-300 interactive">
                    J
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center pulse-vital">
                    <Heart size={6} className="text-white" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    JFK Medical Portal
                  </span>
                  <p className="text-xs text-slate-500 -mt-0.5 font-medium">Excellence in Medicine</p>
                </div>
              </Link>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className={`transition-colors duration-200 ${searchFocused ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <input 
                  placeholder="Search courses, assignments, students..." 
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200/60 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-medical-400/5 to-health-400/5 opacity-0 transition-opacity duration-300 pointer-events-none ${searchFocused ? 'opacity-100' : ''}`}></div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Mobile search */}
              <button className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-200 md:hidden focus-ring interactive">
                <Search size={18} className="text-slate-600" />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-200 focus-ring interactive">
                  <Bell size={18} className="text-slate-600" />
                  <div className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-soft pulse-vital">
                    <span className="text-2xs font-bold text-white">3</span>
                  </div>
                </button>
              </div>

              {/* Theme toggle */}
              <button className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-200 focus-ring interactive">
                <Sun size={18} className="text-slate-600" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-4 pl-3 border-l border-slate-200/60">
                <div className="hidden sm:block text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-sm font-semibold text-slate-700">
                      {user?.displayName || 'Medical Student'}
                    </p>
                    {role === 'student' && mdYear && (
                      <span className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200/50 shadow-soft">
                        {mdYear}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {user?.email}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-glow interactive">
                    <User size={16} className="text-white" />
                  </div>
                  
                  <button 
                    className="p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 focus-ring interactive"
                    onClick={handleSignOut}
                    title="Sign out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          {/* Sidebar */}
          <aside className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 
            transition-transform duration-300 ease-in-out lg:transition-none
            pt-16 lg:pt-0
          `}>
            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm lg:hidden animate-fade-in"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <nav className="relative glass rounded-3xl border border-white/30 p-6 shadow-glow m-2 lg:m-0">
              <div className="space-y-2">
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Academic Portal</h3>
                </div>
                
                <SidebarLink to="/" icon={<Home size={20} />} label="Dashboard" />
                <SidebarLink to="/courses" icon={<BookOpen size={20} />} label="Courses" />
                <SidebarLink to="/enrollments" icon={<Users size={20} />} label="Enrollments" />
                {/* Debug: Current role is {role} */}
                {role === 'admin' ? (
                  <>
                    <SidebarLink to="/manage-users" icon={<UserCheck size={20} />} label="Manage Users" />
                    <SidebarLink to="/sessions" icon={<Calendar size={20} />} label="Sessions" />
                  </>
                ) : role === 'teacher' ? (
                  <SidebarLink to="/assignments" icon={<ClipboardList size={20} />} label="Assignments" />
                ) : (
                  <SidebarLink to="/assignments" icon={<ClipboardList size={20} />} label="Assignments" />
                )}
                <SidebarLink to="/gradebook" icon={<GraduationCap size={20} />} label="Gradebook" />
                <SidebarLink to="/attendance" icon={<CalendarCheck size={20} />} label="Attendance" />
                <SidebarLink to="/announcements" icon={<FileText size={20} />} label="Announcements" />
                <SidebarLink to="/semesters" icon={<Layers size={20} />} label="Semesters" />
                
                <div className="pt-6 mt-6 border-t border-slate-200/60">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Account</h3>
                  <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" />
                </div>
              </div>
              
              {/* Sidebar footer */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50/80 to-teal-50/80 rounded-2xl border border-blue-100/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <div className="p-2 bg-white/60 rounded-lg">
                    <Stethoscope size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Medical Excellence</p>
                    <p className="text-slate-500 mt-0.5">Empowering Future Physicians</p>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      
      <ToastContainer />
    </div>
    </ToastProvider>
  );
}

function SidebarLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink 
      to={to} 
      end 
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-glow' 
          : 'text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-soft'
        }
      `}
    >
      {({ isActive }) => (
        <>
          {/* Background glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${isActive ? 'opacity-0' : ''}`}></div>
          
          {/* Icon */}
          <span className={`relative z-10 transition-all duration-300 ${
            isActive 
              ? 'text-white drop-shadow-sm' 
              : 'text-slate-500 group-hover:text-blue-500'
          }`}>
            {icon}
          </span>
          
          {/* Label */}
          <span className={`relative z-10 transition-all duration-300 ${
            isActive 
              ? 'text-white drop-shadow-sm' 
              : 'group-hover:text-slate-800'
          }`}>
            {label}
          </span>
          
          {/* Active indicator */}
          {isActive && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
          )}
        </>
      )}
    </NavLink>
  );
}


