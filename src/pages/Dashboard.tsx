import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { listCourses } from "../lib/courses";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Bell, 
  CheckCircle,
  AlertTriangle,
  Heart,
  Activity,
  FileText,
  GraduationCap,
  Stethoscope,
  ClipboardList,
  Award,
  Target,
  BarChart3,
  Settings
} from "lucide-react";

export default function Dashboard() {
  const { user, role, mdYear, loading } = useRole();
  const [courses, setCourses] = useState<Array<any>>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await listCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    if (!loading) {
      fetchCourses();
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'there';
  
  const getMDYearDisplay = () => {
    if (role !== 'student' || !mdYear) return '';
    
    const yearNames = {
      'MD-1': 'First Year',
      'MD-2': 'Second Year', 
      'MD-3': 'Third Year',
      'MD-4': 'Fourth Year'
    };
    
    return yearNames[mdYear] || 'Medical Student';
  };

  const getMDYearDescription = () => {
    const descriptions = {
      'MD-1': 'Building your foundation in basic sciences and clinical skills.',
      'MD-2': 'Advancing through systems-based learning and patient interactions.',
      'MD-3': 'Gaining hands-on clinical experience in core rotations.',
      'MD-4': 'Preparing for residency with electives and specialty rotations.'
    };
    
    return mdYear ? descriptions[mdYear] : 'Continue your journey to becoming an exceptional physician.';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${welcomeMessage()}, ${userName}!`}
        breadcrumb={[{ label: 'Dashboard' }]}
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500 text-white border-0 rounded-3xl shadow-glow p-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">Welcome to JFK Medical Portal</h2>
              {role === 'student' && mdYear && (
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-soft">
                  {mdYear} Student
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              {role === 'student' && mdYear && (
                <h3 className="text-lg font-semibold text-white/90 drop-shadow-sm">
                  {getMDYearDisplay()} Medical Student
                </h3>
              )}
              <p className="text-white/80 max-w-lg leading-relaxed">
                {role === 'student' ? getMDYearDescription() : 
                 role === 'teacher' ? "Shape the future of medicine through education." :
                 role === 'admin' ? "Manage and oversee the medical education program." :
                 "Your gateway to medical education excellence."}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-4">
            {role === 'student' && mdYear && (
              <div className="text-center">
                <div className="text-4xl font-bold text-white drop-shadow-lg">{mdYear}</div>
                <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Current Year</div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Stethoscope size={28} className="text-white/90" />
              </div>
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm pulse-vital">
                <Heart size={20} className="text-red-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {coursesLoading ? (
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    courses.length
                  )}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {role === 'admin' ? (
          <>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Faculty Members</p>
                    <p className="text-2xl font-bold text-blue-600">18</p>
                  </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">100%</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Activity size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    ) : (
      <>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments Due</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <ClipboardList size={20} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-blue-600">98%</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Primary Content */}
        <div className="lg:col-span-2 space-y-6">
          {role === 'admin' ? (
            <>
              {/* System Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    System Overview
                  </CardTitle>
                  <Button variant="ghost" size="sm">View Details</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Database Performance</p>
                        <p className="text-sm text-gray-600">All systems operational • Response time: 45ms</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">Excellent</p>
                        <p className="text-xs text-gray-500">99.9% uptime</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">User Authentication</p>
                        <p className="text-sm text-gray-600">247 active users • 18 faculty members</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Active</p>
                        <p className="text-xs text-gray-500">No issues</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Course Management</p>
                        <p className="text-sm text-gray-600">{courses.length} active courses • All updated</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">Updated</p>
                        <p className="text-xs text-gray-500">Last sync: 2 min ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent System Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-green-600" />
                    Recent System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New Course Created</p>
                        <p className="text-xs text-gray-500">ANAT101 - Human Anatomy • 2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New Student Registration</p>
                        <p className="text-xs text-gray-500">John Doe (MD-1) • Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Stethoscope size={16} className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Faculty Account Updated</p>
                        <p className="text-xs text-gray-500">Dr. Sarah Johnson profile • 2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Upcoming Schedule */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} className="text-blue-600" />
                    Today's Schedule
                  </CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Anatomy Lecture - Cardiovascular System</p>
                        <p className="text-sm text-gray-600">Dr. Sarah Johnson • Room 201</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">9:00 AM</p>
                        <p className="text-xs text-gray-500">1h 30m</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Clinical Skills Lab</p>
                        <p className="text-sm text-gray-600">Prof. Michael Chen • Lab A</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">2:00 PM</p>
                        <p className="text-xs text-gray-500">2h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">OSCE Practice Session</p>
                        <p className="text-sm text-gray-600">Various Stations • Clinical Center</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">4:30 PM</p>
                        <p className="text-xs text-gray-500">1h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Physiology Quiz Completed</p>
                        <p className="text-xs text-gray-500">Score: 94% • 2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Case Study Submitted</p>
                        <p className="text-xs text-gray-500">Cardiology Case #3 • Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award size={16} className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Achievement Unlocked</p>
                        <p className="text-xs text-gray-500">"Perfect Attendance" badge earned • 2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right Column - Secondary Content */}
        <div className="space-y-6">
          {/* MD Year Progress Card - Only for students */}
          {role === 'student' && mdYear && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <GraduationCap size={20} />
                  {mdYear} Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Academic Year</span>
                    <Badge variant="default">{mdYear}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Year Progress</span>
                      <span className="font-medium">
                        {mdYear === 'MD-1' ? '72%' : 
                         mdYear === 'MD-2' ? '85%' : 
                         mdYear === 'MD-3' ? '45%' : '92%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: mdYear === 'MD-1' ? '72%' : 
                                 mdYear === 'MD-2' ? '85%' : 
                                 mdYear === 'MD-3' ? '45%' : '92%'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {mdYear === 'MD-1' && 'Focus: Basic Sciences & Fundamentals'}
                    {mdYear === 'MD-2' && 'Focus: Pathophysiology & Clinical Skills'}
                    {mdYear === 'MD-3' && 'Focus: Core Clinical Rotations'}
                    {mdYear === 'MD-4' && 'Focus: Electives & Residency Prep'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {role === 'admin' ? (
            <>
              {/* System Alerts */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={20} />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Database Online</p>
                        <p className="text-xs text-gray-500">All systems operational</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Backup Complete</p>
                        <p className="text-xs text-gray-500">Last backup: 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} className="text-purple-600" />
                    Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Users size={16} />
                      Manage Users
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BookOpen size={16} />
                      Course Management
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BarChart3 size={16} />
                      System Reports
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Settings size={16} />
                      System Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Urgent Tasks */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle size={20} />
                    Urgent Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Immunization Records</p>
                        <p className="text-xs text-gray-500">Due tomorrow</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ethics Essay</p>
                        <p className="text-xs text-gray-500">Due in 3 days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} className="text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BookOpen size={16} />
                      Courses
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <ClipboardList size={16} />
                      Assignments
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BarChart3 size={16} />
                      Grades
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Calendar size={16} />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Announcements */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-blue-600" />
                Latest Announcements
              </CardTitle>
            </CardHeader>
          <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-l-blue-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">Welcome MD-1 Cohort!</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <div className="border-l-4 border-l-green-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">Lab Safety Training Schedule</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
                <div className="border-l-4 border-l-orange-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">Library Extended Hours</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
            </div>
          </CardContent>
        </Card>

          {/* Quick Actions */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <BookOpen size={16} />
                  Courses
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <ClipboardList size={16} />
                  Assignments
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <BarChart3 size={16} />
                  Grades
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Calendar size={16} />
                  Schedule
                </Button>
              </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Active Courses Section */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            Active Courses ({courses.length})
          </CardTitle>
        </CardHeader>
          <CardContent>
          {coursesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600">Loading courses...</span>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <BookOpen size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Courses Available</h3>
              <p className="text-gray-600 mb-4">No courses have been created yet.</p>
              <Button variant="primary" className="flex items-center gap-2">
                <BookOpen size={16} />
                Create First Course
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {course.code} — {course.title}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200">
                          {course.semester}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200">
                          {course.credits} Credits
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>Capacity: {course.capacity} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope size={14} />
                      <span>Instructor: {course.instructor || 'TBD'}</span>
                    </div>
                    {course.description && (
                      <div className="flex items-start gap-2">
                        <FileText size={14} className="mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-2 text-xs">{course.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                      <span>ID: {String(course.ownerId || "").slice(0, 8)}…</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {courses.length > 6 && (
            <div className="mt-6 text-center">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen size={16} />
                View All Courses ({courses.length})
              </Button>
            </div>
          )}
          </CardContent>
        </Card>
    </div>
  );
}


