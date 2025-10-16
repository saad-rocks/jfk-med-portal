import { Menu, Bell, Search, Settings, LogOut, Home, BookOpen, ClipboardList, GraduationCap, Users, Layers, CalendarCheck, FileText, Sun, User, Stethoscope, Heart, UserCheck, Calendar, Clock, Award, UserPlus } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Suspense, lazy, useCallback, useMemo, memo } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, ToastProvider } from "../components/ui/toast";
import { useRole } from "../hooks/useRole";

// Optimized loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
}

// Lazy wrapper for optimized loading
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, role, mdYear } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log role for troubleshooting

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
    }
  }, [navigate]);

  return (
    <ToastProvider>
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-teal-50/20 page-transition">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20 shadow-soft">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="h-14 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                className="p-2.5 rounded-xl hover:bg-white/50 transition-colors duration-200 lg:hidden focus-ring interactive"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <Menu size={20} className="text-slate-600" />
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src="/jfk-logo.png"
                  alt="JFK Medical Center Logo"
                  className="h-12 w-12 object-cover rounded-full shadow-md group-hover:opacity-90 transition-opacity duration-200"
                />
                <div className="hidden sm:block">
                  <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    JFK Medical Portal
                  </span>
                  <p className="text-xs text-slate-500 -mt-0.5 font-medium">Excellence in Medical Education</p>
                </div>
              </Link>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className={`relative w-full transition-transform duration-200 ${searchFocused ? 'scale-105' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className={`transition-colors duration-200 ${searchFocused ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <input
                  placeholder="Search courses, assignments, students..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-slate-200/60 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-colors duration-200 hover:border-slate-300/80 text-slate-700 placeholder-slate-400"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-medical-400/5 to-health-400/5 opacity-0 transition-opacity duration-200 pointer-events-none ${searchFocused ? 'opacity-100' : ''}`}></div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Mobile search */}
              <button className="p-2.5 rounded-xl hover:bg-white/50 transition-colors duration-200 md:hidden focus-ring interactive">
                <Search size={18} className="text-slate-600" />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button className="p-2.5 rounded-xl hover:bg-white/50 transition-colors duration-200 focus-ring interactive group">
                  <Bell size={18} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-xs font-bold text-white">5</span>
                  </div>
                </button>
              </div>

              {/* Theme toggle */}
              <button className="p-2.5 rounded-xl hover:bg-white/50 transition-colors duration-200 focus-ring interactive">
                <Sun size={18} className="text-slate-600" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60">
                <div className="hidden sm:block text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-sm font-semibold text-slate-700">
                      {user?.displayName || 'Medical Student'}
                    </p>
                    {role === 'student' && mdYear && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 text-xs font-bold rounded-md border border-blue-200/50">
                        {mdYear}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {user?.email}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-md">
                    <User size={14} className="text-white" />
                  </div>

                  <button
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    onClick={handleSignOut}
                    title="Sign out"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex gap-8 py-6">
          {/* Sidebar */}
          <aside className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-56
            transition-transform duration-300 ease-in-out lg:transition-none
            pt-14 lg:pt-0
          `}>
            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/30 lg:hidden animate-fade-in"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <nav className="relative glass rounded-2xl border border-white/30 p-4 shadow-glow m-2 lg:m-0">
              <div className="space-y-1">
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Academic Portal</h3>
                </div>

                <SidebarLink to="/" icon={<Home size={18} />} label="Dashboard" />
                <SidebarLink to="/courses" icon={<BookOpen size={18} />} label="Courses" />
                {role === 'student' ? (
                  <SidebarLink to="/grades" icon={<Award size={18} />} label="My Grades" />
                ) : (
                  <SidebarLink to="/enrollments" icon={<Users size={18} />} label="Enrollments" />
                )}
                {/* Debug: Current role is {role} */}
                {role === 'admin' ? (
                  <>
                    <SidebarLink to="/manage-users" icon={<UserCheck size={18} />} label="Manage Users" />
                    <SidebarLink to="/registration-requests" icon={<UserPlus size={18} />} label="Registration Requests" />
                    <SidebarLink to="/sessions" icon={<Calendar size={18} />} label="Sessions" />
                  </>
                ) : role === 'teacher' ? (
                  <SidebarLink to="/assignments" icon={<ClipboardList size={18} />} label="Assignments" />
                ) : (
                  <SidebarLink to="/assignments" icon={<ClipboardList size={18} />} label="Assignments" />
                )}
                {/* Gradebook is now accessed through course detail pages */}
                {(role === "admin" || role === "teacher") && (
                  <SidebarLink to="/time" icon={<Clock size={18} />} label="Time Tracking" />
                )}
                <SidebarLink to="/attendance" icon={<CalendarCheck size={18} />} label="Attendance" />
                {role === "student" ? (
                  <SidebarLink to="/notice-board" icon={<Bell size={18} />} label="Notice Board" />
                ) : (
                  <SidebarLink to="/announcements" icon={<FileText size={18} />} label="Announcements" />
                )}
                <SidebarLink to="/semesters" icon={<Layers size={18} />} label="Semesters" />

                <div className="pt-4 mt-4 border-t border-slate-200/60">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Account</h3>
                  <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
                </div>
              </div>

              {/* Sidebar footer - more compact */}
              <div className="mt-6 p-3 bg-gradient-to-r from-blue-50/70 to-teal-50/70 rounded-xl border border-blue-100/40">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <div className="p-1.5 bg-white/60 rounded-lg">
                    <Stethoscope size={12} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-xs">Medical Excellence</p>
                    <p className="text-slate-500 text-2xs">Future Physicians</p>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="animate-fade-in bg-white/90 rounded-2xl border border-slate-200/60 shadow-soft p-6 lg:p-8">
              <LazyWrapper>
                <Outlet />
              </LazyWrapper>
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
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 group relative overflow-hidden
        ${isActive
          ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
          : 'text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm'
        }
      `}
    >
      {({ isActive }) => (
        <>
          {/* Background glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${isActive ? 'opacity-0' : ''}`}></div>

          {/* Icon */}
          <span className={`relative z-10 transition-colors duration-300 flex-shrink-0 ${
            isActive
              ? 'text-white drop-shadow-sm'
              : 'text-slate-500 group-hover:text-blue-500'
          }`}>
            {icon}
          </span>

          {/* Label */}
          <span className={`relative z-10 transition-colors duration-300 ${
            isActive
              ? 'text-white drop-shadow-sm'
              : 'group-hover:text-slate-800'
          }`}>
            {label}
          </span>

          {/* Active indicator */}
          {isActive && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/90 rounded-full"></div>
          )}
        </>
      )}
    </NavLink>
  );
}

// Memoize the entire AppShell component to prevent unnecessary re-renders
export default memo(AppShell);


