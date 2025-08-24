import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { listCourses } from "../lib/courses";
import { listEnrollmentsForStudent, listEnrollments } from "../lib/enrollments";
import { getUserStats } from "../lib/users";
import { getCurrentSessionFromDB, getNextSession, getAllSessions, getSessionDisplayName, getSessionStatus, getSessionProgress, initializeDefaultSessions } from "../lib/sessions";
// Dashboard Component
import { Calendar, Clock, BookOpen, Users, TrendingUp, Bell, CheckCircle, AlertTriangle, Heart, Activity, FileText, GraduationCap, Stethoscope, ClipboardList, Award, Target, BarChart3, Settings } from "lucide-react";
function Dashboard() {
    const { user, role, mdYear, loading } = useRole();
    // Handle potential null/undefined values gracefully
    const safeUser = user || null;
    const safeRole = role || 'student';
    const safeMdYear = mdYear || undefined;
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [courseEnrollments, setCourseEnrollments] = useState({});
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
    const [userStats, setUserStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [currentSession, setCurrentSession] = useState(null);
    const [nextSession, setNextSession] = useState(null);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const fetchedCourses = await listCourses();
                setCourses(fetchedCourses);
            }
            catch (error) {
                console.error('Failed to fetch courses:', error);
            }
            finally {
                setCoursesLoading(false);
            }
        };
        const fetchEnrollments = async () => {
            if (safeRole === 'student' && safeUser?.uid) {
                try {
                    const studentEnrollments = await listEnrollmentsForStudent(safeUser.uid);
                    setEnrollments(studentEnrollments);
                }
                catch (error) {
                    console.error('Failed to fetch enrollments:', error);
                }
                finally {
                    setEnrollmentsLoading(false);
                }
            }
            else {
                setEnrollmentsLoading(false);
            }
        };
        const fetchCourseEnrollments = async () => {
            if (safeRole === 'admin' && courses.length > 0) {
                try {
                    // For admins, fetch enrollment counts for all courses
                    const enrollmentCounts = {};
                    for (const course of courses) {
                        const courseEnrollments = await listEnrollments({ courseId: course.id });
                        const activeEnrollments = courseEnrollments.filter(e => e.status === 'enrolled');
                        enrollmentCounts[course.id] = activeEnrollments.length;
                    }
                    setCourseEnrollments(enrollmentCounts);
                }
                catch (error) {
                    console.error('Failed to fetch course enrollments:', error);
                }
            }
        };
        const fetchUserStats = async () => {
            try {
                const stats = await getUserStats();
                setUserStats(stats);
            }
            catch (error) {
                console.error('Failed to fetch user stats:', error);
                // Set default values on error
                setUserStats({
                    totalUsers: 0,
                    students: 0,
                    teachers: 0,
                    admins: 0,
                    activeUsers: 0
                });
            }
            finally {
                setStatsLoading(false);
            }
        };
        const fetchSessions = async () => {
            try {
                // Initialize default sessions for current year if none exist
                await initializeDefaultSessions();
                // Get all sessions
                const allSessions = await getAllSessions();
                // Get current session
                const current = await getCurrentSessionFromDB();
                setCurrentSession(current);
                // Get next session
                const next = getNextSession(allSessions);
                setNextSession(next);
            }
            catch (error) {
                console.error('Failed to fetch sessions:', error);
            }
            finally {
                setSessionsLoading(false);
            }
        };
        const initializeData = async () => {
            if (!loading) {
                // Fetch data
                await fetchCourses();
                await fetchEnrollments();
                await fetchCourseEnrollments();
                await fetchUserStats();
                await fetchSessions();
            }
        };
        initializeData();
    }, [loading]);
    // Fetch course enrollments when courses are loaded (for admin role)
    useEffect(() => {
        if (safeRole === 'admin' && courses.length > 0) {
            const fetchCourseEnrollments = async () => {
                try {
                    console.log('🔧 Fetching course enrollments for admin...');
                    // For admins, fetch enrollment counts for all courses
                    const enrollmentCounts = {};
                    for (const course of courses) {
                        console.log(`🔧 Fetching enrollments for course: ${course.code} (${course.id})`);
                        const courseEnrollments = await listEnrollments({ courseId: course.id });
                        const activeEnrollments = courseEnrollments.filter(e => e.status === 'enrolled');
                        enrollmentCounts[course.id] = activeEnrollments.length;
                        console.log(`🔧 Course ${course.code}: ${activeEnrollments.length} enrolled students`);
                    }
                    console.log('🔧 Final enrollment counts:', enrollmentCounts);
                    setCourseEnrollments(enrollmentCounts);
                }
                catch (error) {
                    console.error('Failed to fetch course enrollments:', error);
                }
            };
            fetchCourseEnrollments();
        }
    }, [courses, safeRole]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-gray-600", children: "Loading your dashboard..." })] }) }));
    }
    // Dashboard is ready to render
    const welcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return "Good morning";
        if (hour < 18)
            return "Good afternoon";
        return "Good evening";
    };
    const userName = safeUser?.displayName || safeUser?.email?.split('@')[0] || 'there';
    const getMDYearDisplay = () => {
        if (safeRole !== 'student' || !safeMdYear)
            return '';
        const yearNames = {
            'MD-1': 'First Year',
            'MD-2': 'Second Year',
            'MD-3': 'Third Year',
            'MD-4': 'Fourth Year'
        };
        return yearNames[safeMdYear] || 'Medical Student';
    };
    const getMDYearDescription = () => {
        const descriptions = {
            'MD-1': 'Building your foundation in basic sciences and clinical skills.',
            'MD-2': 'Advancing through systems-based learning and patient interactions.',
            'MD-3': 'Gaining hands-on clinical experience in core rotations.',
            'MD-4': 'Preparing for residency with electives and specialty rotations.'
        };
        return safeMdYear ? descriptions[safeMdYear] : 'Continue your journey to becoming an exceptional physician.';
    };
    // Helper functions for course display
    const isEnrolledInCourse = (courseId) => {
        return enrollments.some(enrollment => enrollment.courseId === courseId && enrollment.status === 'enrolled');
    };
    const getEnrolledCourses = () => {
        return courses.filter(course => isEnrolledInCourse(course.id));
    };
    const getCoursesToDisplay = () => {
        if (safeRole === 'student') {
            return getEnrolledCourses();
        }
        return courses;
    };
    const getEnrollmentCount = (courseId) => {
        const count = courseEnrollments[courseId] || 0;
        console.log(`🔧 getEnrollmentCount for course ${courseId}: ${count}`);
        return count;
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: `${welcomeMessage()}, ${userName}!`, breadcrumb: [{ label: 'Dashboard' }] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500 text-white border-0 rounded-3xl shadow-glow p-6 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" }), _jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" }), _jsxs("div", { className: "relative flex items-center justify-between", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("h2", { className: "text-2xl font-bold text-white drop-shadow-sm", children: "Welcome to JFK Medical Portal" }), safeRole === 'student' && safeMdYear && (_jsxs(Badge, { className: "bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-soft", children: [safeMdYear, " Student"] }))] }), _jsxs("div", { className: "space-y-2", children: [safeRole === 'student' && safeMdYear && (_jsxs("h3", { className: "text-lg font-semibold text-white/90 drop-shadow-sm", children: [getMDYearDisplay(), " Medical Student"] })), _jsx("p", { className: "text-white/80 max-w-lg leading-relaxed", children: safeRole === 'student' ? getMDYearDescription() :
                                                    safeRole === 'teacher' ? "Shape the future of medicine through education." :
                                                        safeRole === 'admin' ? "Manage and oversee the medical education program." :
                                                            "Your gateway to medical education excellence." })] })] }), _jsxs("div", { className: "hidden md:flex flex-col items-center gap-4", children: [safeRole === 'student' && safeMdYear && (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl font-bold text-white drop-shadow-lg", children: safeMdYear }), _jsx("div", { className: "text-xs text-white/70 font-medium uppercase tracking-wider", children: "Current Year" })] })), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-white/10 rounded-full backdrop-blur-sm", children: _jsx(Stethoscope, { size: 28, className: "text-white/90" }) }), _jsx("div", { className: "p-2 bg-white/10 rounded-full backdrop-blur-sm pulse-vital", children: _jsx(Heart, { size: 20, className: "text-red-200" }) })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "hover:shadow-lg transition-shadow", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-lg", children: [_jsx(Calendar, { className: "h-5 w-5 text-blue-600" }), "Current Academic Session"] }) }), _jsx(CardContent, { children: sessionsLoading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Loading session info..." })] })) : currentSession ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: getSessionDisplayName(currentSession) }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: currentSession.description || 'Current academic session' })] }), _jsx(Badge, { className: "bg-green-100 text-green-800 border-green-200", children: "Active" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Start Date:" }), _jsx("span", { className: "font-medium", children: currentSession.startDate instanceof Date
                                                                ? currentSession.startDate.toLocaleDateString()
                                                                : currentSession.startDate.toDate().toLocaleDateString() })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "End Date:" }), _jsx("span", { className: "font-medium", children: currentSession.endDate instanceof Date
                                                                ? currentSession.endDate.toLocaleDateString()
                                                                : currentSession.endDate.toDate().toLocaleDateString() })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Session Progress" }), _jsxs("span", { className: "font-medium", children: [getSessionProgress(currentSession), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${getSessionProgress(currentSession)}%` } }) })] })] })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(Calendar, { className: "h-12 w-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-600", children: "No active session found" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Please contact administration" })] })) })] }), _jsxs(Card, { className: "hover:shadow-lg transition-shadow", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-lg", children: [_jsx(Clock, { className: "h-5 w-5 text-orange-600" }), "Next Session"] }) }), _jsx(CardContent, { children: sessionsLoading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Loading session info..." })] })) : nextSession ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: getSessionDisplayName(nextSession) }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: nextSession.description || 'Upcoming academic session' })] }), _jsx(Badge, { className: "bg-orange-100 text-orange-800 border-orange-200", children: "Upcoming" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Start Date:" }), _jsx("span", { className: "font-medium", children: nextSession.startDate instanceof Date
                                                                ? nextSession.startDate.toLocaleDateString()
                                                                : nextSession.startDate.toDate().toLocaleDateString() })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "End Date:" }), _jsx("span", { className: "font-medium", children: nextSession.endDate instanceof Date
                                                                ? nextSession.endDate.toLocaleDateString()
                                                                : nextSession.endDate.toDate().toLocaleDateString() })] })] }), _jsx("div", { className: "bg-orange-50 rounded-lg p-3", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: (() => {
                                                            const startDate = nextSession.startDate instanceof Date
                                                                ? nextSession.startDate
                                                                : nextSession.startDate.toDate();
                                                            const daysUntil = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                                            return daysUntil > 0 ? daysUntil : 0;
                                                        })() }), _jsx("div", { className: "text-sm text-orange-700", children: "Days until next session" })] }) })] })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(Clock, { className: "h-12 w-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-600", children: "No upcoming sessions" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "All sessions have been scheduled" })] })) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(Card, { className: "hover:shadow-lg transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: safeRole === 'student' ? 'Enrolled Courses' : 'Active Courses' }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: (coursesLoading || (safeRole === 'student' && enrollmentsLoading)) ? (_jsx("div", { className: "w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" })) : (getCoursesToDisplay().length) })] }), _jsx("div", { className: "h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx(BookOpen, { size: 20, className: "text-blue-600" }) })] }) }) }), safeRole === 'admin' ? (_jsxs(_Fragment, { children: [_jsx(Card, { className: "hover:shadow-lg transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Students" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: statsLoading ? (_jsx("div", { className: "w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" })) : (userStats?.students || 0) })] }), _jsx("div", { className: "h-10 w-10 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(Users, { size: 20, className: "text-green-600" }) })] }) }) }), _jsx(Card, { className: "hover:shadow-lg transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Faculty Members" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: statsLoading ? (_jsx("div", { className: "w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" })) : (userStats?.teachers || 0) })] }), _jsx("div", { className: "h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx(Stethoscope, { size: 20, className: "text-blue-600" }) })] }) }) }), _jsx(Card, { className: "hover:shadow-lg transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "System Health" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: "100%" })] }), _jsx("div", { className: "h-10 w-10 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(Activity, { size: 20, className: "text-green-600" }) })] }) }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Card, { className: "hover:shadow-lg transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Assignments Due" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "3" })] }), _jsx("div", { className: "h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center", children: _jsx(ClipboardList, { size: 20, className: "text-orange-600" }) })] }) }) }), _jsx(Card, { className: "hover:shadow-lg transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Overall Grade" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: "92%" })] }), _jsx("div", { className: "h-10 w-10 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(TrendingUp, { size: 20, className: "text-green-600" }) })] }) }) }), _jsx(Card, { className: "hover:shadow-lg transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Attendance" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: "98%" })] }), _jsx("div", { className: "h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx(Users, { size: 20, className: "text-blue-600" }) })] }) }) })] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: safeRole === 'admin' ? (_jsxs(_Fragment, { children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart3, { size: 20, className: "text-blue-600" }), "System Overview"] }), _jsx(Button, { variant: "ghost", size: "sm", children: "View Details" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4 p-3 bg-blue-50 rounded-lg", children: [_jsx("div", { className: "h-2 w-2 bg-blue-600 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Database Performance" }), _jsx("p", { className: "text-sm text-gray-600", children: "All systems operational \u2022 Response time: 45ms" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-blue-600", children: "Excellent" }), _jsx("p", { className: "text-xs text-gray-500", children: "99.9% uptime" })] })] }), _jsxs("div", { className: "flex items-center gap-4 p-3 bg-green-50 rounded-lg", children: [_jsx("div", { className: "h-2 w-2 bg-green-600 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: "User Authentication" }), _jsx("p", { className: "text-sm text-gray-600", children: statsLoading ? 'Loading user data...' :
                                                                            `${userStats?.activeUsers || 0} active users • ${userStats?.teachers || 0} faculty members` })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-green-600", children: "Active" }), _jsx("p", { className: "text-xs text-gray-500", children: "No issues" })] })] }), _jsxs("div", { className: "flex items-center gap-4 p-3 bg-orange-50 rounded-lg", children: [_jsx("div", { className: "h-2 w-2 bg-orange-600 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Course Management" }), _jsxs("p", { className: "text-sm text-gray-600", children: [courses.length, " active courses \u2022 All updated"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-orange-600", children: "Updated" }), _jsx("p", { className: "text-xs text-gray-500", children: "Last sync: 2 min ago" })] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Activity, { size: 20, className: "text-green-600" }), "Recent System Activity"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(CheckCircle, { size: 16, className: "text-green-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "New Course Created" }), _jsx("p", { className: "text-xs text-gray-500", children: "ANAT101 - Human Anatomy \u2022 2 hours ago" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Users, { size: 16, className: "text-blue-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "New Student Registration" }), _jsx("p", { className: "text-xs text-gray-500", children: "John Doe (MD-1) \u2022 Yesterday" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Stethoscope, { size: 16, className: "text-orange-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Faculty Account Updated" }), _jsx("p", { className: "text-xs text-gray-500", children: "Dr. Sarah Johnson profile \u2022 2 days ago" })] })] })] }) })] })] })) : (_jsxs(_Fragment, { children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 20, className: "text-blue-600" }), "Today's Schedule"] }), _jsx(Button, { variant: "ghost", size: "sm", children: "View All" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4 p-3 bg-blue-50 rounded-lg", children: [_jsx("div", { className: "h-2 w-2 bg-blue-600 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Anatomy Lecture - Cardiovascular System" }), _jsx("p", { className: "text-sm text-gray-600", children: "Dr. Sarah Johnson \u2022 Room 201" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-blue-600", children: "9:00 AM" }), _jsx("p", { className: "text-xs text-gray-500", children: "1h 30m" })] })] }), _jsxs("div", { className: "flex items-center gap-4 p-3 bg-green-50 rounded-lg", children: [_jsx("div", { className: "h-2 w-2 bg-green-600 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: "Clinical Skills Lab" }), _jsx("p", { className: "text-sm text-gray-600", children: "Prof. Michael Chen \u2022 Lab A" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-green-600", children: "2:00 PM" }), _jsx("p", { className: "text-xs text-gray-500", children: "2h" })] })] }), _jsxs("div", { className: "flex items-center gap-4 p-3 bg-orange-50 rounded-lg", children: [_jsx("div", { className: "h-2 w-2 bg-orange-600 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: "OSCE Practice Session" }), _jsx("p", { className: "text-sm text-gray-600", children: "Various Stations \u2022 Clinical Center" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-orange-600", children: "4:30 PM" }), _jsx("p", { className: "text-xs text-gray-500", children: "1h" })] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Activity, { size: 20, className: "text-green-600" }), "Recent Activity"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(CheckCircle, { size: 16, className: "text-green-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Physiology Quiz Completed" }), _jsx("p", { className: "text-xs text-gray-500", children: "Score: 94% \u2022 2 hours ago" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(FileText, { size: 16, className: "text-blue-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Case Study Submitted" }), _jsx("p", { className: "text-xs text-gray-500", children: "Cardiology Case #3 \u2022 Yesterday" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(Award, { size: 16, className: "text-orange-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Achievement Unlocked" }), _jsx("p", { className: "text-xs text-gray-500", children: "\"Perfect Attendance\" badge earned \u2022 2 days ago" })] })] })] }) })] })] })) }), _jsxs("div", { className: "space-y-6", children: [safeRole === 'student' && safeMdYear && (_jsxs(Card, { className: "border-l-4 border-l-blue-500", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-blue-700", children: [_jsx(GraduationCap, { size: 20 }), safeMdYear, " Progress"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Academic Year" }), _jsx(Badge, { variant: "default", children: safeMdYear })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Year Progress" }), _jsx("span", { className: "font-medium", children: safeMdYear === 'MD-1' ? '72%' :
                                                                        safeMdYear === 'MD-2' ? '85%' :
                                                                            safeMdYear === 'MD-3' ? '45%' : '92%' })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: {
                                                                    width: safeMdYear === 'MD-1' ? '72%' :
                                                                        safeMdYear === 'MD-2' ? '85%' :
                                                                            safeMdYear === 'MD-3' ? '45%' : '92%'
                                                                } }) })] }), _jsxs("div", { className: "text-xs text-gray-500", children: [safeMdYear === 'MD-1' && 'Focus: Basic Sciences & Fundamentals', safeMdYear === 'MD-2' && 'Focus: Pathophysiology & Clinical Skills', safeMdYear === 'MD-3' && 'Focus: Core Clinical Rotations', safeMdYear === 'MD-4' && 'Focus: Electives & Residency Prep'] })] }) })] })), safeRole === 'admin' ? (_jsxs(_Fragment, { children: [_jsxs(Card, { className: "border-l-4 border-l-green-500", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-green-700", children: [_jsx(CheckCircle, { size: 20 }), "System Status"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-2 w-2 bg-green-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: "Database Online" }), _jsx("p", { className: "text-xs text-gray-500", children: "All systems operational" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-2 w-2 bg-green-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: "Backup Complete" }), _jsx("p", { className: "text-xs text-gray-500", children: "Last backup: 2 hours ago" })] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { size: 20, className: "text-purple-600" }), "Admin Actions"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(Users, { size: 16 }), "Manage Users"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(BookOpen, { size: 16 }), "Course Management"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(BarChart3, { size: 16 }), "System Reports"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(Settings, { size: 16 }), "System Settings"] })] }) })] })] })) : (_jsxs(_Fragment, { children: [_jsxs(Card, { className: "border-l-4 border-l-red-500", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-red-700", children: [_jsx(AlertTriangle, { size: 20 }), "Urgent Tasks"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-2 w-2 bg-red-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: "Immunization Records" }), _jsx("p", { className: "text-xs text-gray-500", children: "Due tomorrow" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-2 w-2 bg-orange-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: "Ethics Essay" }), _jsx("p", { className: "text-xs text-gray-500", children: "Due in 3 days" })] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { size: 20, className: "text-purple-600" }), "Quick Actions"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(BookOpen, { size: 16 }), "Courses"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(ClipboardList, { size: 16 }), "Assignments"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(BarChart3, { size: 16 }), "Grades"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(Calendar, { size: 16 }), "Schedule"] })] }) })] })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Bell, { size: 20, className: "text-blue-600" }), "Latest Announcements"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "border-l-4 border-l-blue-500 pl-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Welcome MD-1 Cohort!" }), _jsx("p", { className: "text-xs text-gray-500", children: "1 day ago" })] }), _jsxs("div", { className: "border-l-4 border-l-green-500 pl-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Lab Safety Training Schedule" }), _jsx("p", { className: "text-xs text-gray-500", children: "2 days ago" })] }), _jsxs("div", { className: "border-l-4 border-l-orange-500 pl-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Library Extended Hours" }), _jsx("p", { className: "text-xs text-gray-500", children: "3 days ago" })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { size: 20, className: "text-purple-600" }), "Quick Actions"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(BookOpen, { size: 16 }), "Courses"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(ClipboardList, { size: 16 }), "Assignments"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(BarChart3, { size: 16 }), "Grades"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "justify-start gap-2", children: [_jsx(Calendar, { size: 16 }), "Schedule"] })] }) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BookOpen, { size: 20, className: "text-blue-600" }), safeRole === 'student' ? 'My Enrolled Courses' : 'Active Courses', " (", getCoursesToDisplay().length, ")"] }) }), _jsxs(CardContent, { children: [(coursesLoading || (safeRole === 'student' && enrollmentsLoading)) ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-gray-600", children: "Loading courses..." })] }) })) : getCoursesToDisplay().length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4", children: _jsx(BookOpen, { size: 32, className: "text-blue-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: safeRole === 'student' ? 'No Enrolled Courses' : 'No Courses Available' }), _jsx("p", { className: "text-gray-600 mb-4", children: safeRole === 'student'
                                            ? 'You are not enrolled in any courses yet. Visit the Courses page to enroll in available courses.'
                                            : 'No courses have been created yet.' }), _jsxs(Button, { variant: "primary", className: "flex items-center gap-2", children: [_jsx(BookOpen, { size: 16 }), safeRole === 'student' ? 'Browse Courses' : 'Create First Course'] })] })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: getCoursesToDisplay().slice(0, 6).map((course) => (_jsxs("div", { className: "p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow", children: [_jsx("div", { className: "flex items-start justify-between mb-3", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("h4", { className: "font-semibold text-gray-900", children: [course.code, " \u2014 ", course.title] }), safeRole === 'admin' && (_jsxs(Badge, { className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 shadow-sm", children: [getEnrollmentCount(course.id), " enrolled"] }))] }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Badge, { variant: "default", className: "text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200", children: course.semester }), _jsxs(Badge, { variant: "secondary", className: "text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200", children: [course.credits, " Credits"] })] })] }) }), _jsxs("div", { className: "space-y-2 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { size: 14 }), _jsx("span", { children: safeRole === 'admin'
                                                                ? `Capacity: ${course.capacity} students (${getEnrollmentCount(course.id)} enrolled)`
                                                                : `Capacity: ${course.capacity} students` })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Stethoscope, { size: 14 }), _jsxs("span", { children: ["Instructor: ", course.instructor || 'TBD'] })] }), course.description && (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(FileText, { size: 14, className: "mt-0.5 flex-shrink-0" }), _jsx("p", { className: "line-clamp-2 text-xs", children: course.description })] }))] }), _jsx("div", { className: "mt-3 pt-3 border-t border-gray-100", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("span", { children: ["Created: ", new Date(course.createdAt).toLocaleDateString()] }), _jsxs("span", { children: ["ID: ", String(course.ownerId || "").slice(0, 8), "\u2026"] })] }) })] }, course.id))) })), getCoursesToDisplay().length > 6 && (_jsx("div", { className: "mt-6 text-center", children: _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(BookOpen, { size: 16 }), safeRole === 'student' ? 'View All Enrolled Courses' : 'View All Courses', " (", getCoursesToDisplay().length, ")"] }) }))] })] })] }));
}
export default Dashboard;
