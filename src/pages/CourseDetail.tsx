import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  BookOpen, 
  Users, 
  FileText, 
  GraduationCap, 
  Stethoscope, 
  Calendar,
  Clock,
  Award,
  TrendingUp,
  BarChart3
} from "lucide-react";
import type { Course, User, Assignment, Enrollment } from "../types";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { role } = useRole();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching course data for courseId:', courseId);
      
      // Fetch course details
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      console.log('📋 Course document exists:', courseDoc.exists());
      if (courseDoc.exists()) {
        const courseData = { ...courseDoc.data(), id: courseDoc.id } as Course;
        console.log('✅ Course data fetched:', courseData);
        setCourse(courseData);
        
        // Fetch instructor details
        const instructorQuery = query(collection(db, 'users'), where('uid', '==', courseData.ownerId));
        const instructorSnapshot = await getDocs(instructorQuery);
        if (!instructorSnapshot.empty) {
          setInstructor(instructorSnapshot.docs[0].data() as User);
        }
      } else {
        console.log('❌ Course document not found for ID:', courseId);
      }

      // Fetch assignments
      const assignmentsQuery = query(collection(db, 'assignments'), where('courseId', '==', courseId));
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const assignmentsData = assignmentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Assignment));
      setAssignments(assignmentsData);

      // Fetch enrollments
      const enrollmentsQuery = query(collection(db, 'enrollments'), where('courseId', '==', courseId));
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const enrollmentsData = enrollmentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Enrollment));
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading course details...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Course Not Found</h3>
          <p className="text-red-700">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  const isTeacher = role === 'teacher' || role === 'admin';
  const totalStudents = enrollments.length;
  const totalAssignments = assignments.length;
  const upcomingAssignments = assignments.filter(a => a.dueAt > Date.now()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-2">
            {course.code} • {course.semester} • {course.credits} credit{course.credits !== 1 ? 's' : ''}
          </p>
        </div>
        {isTeacher && (
          <div className="flex gap-3">
            <Button asChild>
              <Link to={`/courses/${courseId}/assignments/teacher`}>
                <FileText className="w-4 h-4 mr-2" />
                Manage Assignments
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/courses/${courseId}/clinical-assessments`}>
                <Stethoscope className="w-4 h-4 mr-2" />
                Clinical Assessments
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrolled Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{course.capacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{course.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Course Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code:</span>
                    <span className="font-medium">{course.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits:</span>
                    <span className="font-medium">{course.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Semester:</span>
                    <span className="font-medium">{course.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{course.capacity}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Instructor</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{instructor?.name || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{instructor?.email || 'TBD'}</span>
                  </div>
                  {instructor?.department && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{instructor.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isTeacher ? (
              <>
                <Button asChild className="w-full justify-start">
                  <Link to={`/courses/${courseId}/assignments/teacher`}>
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Assignments
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to={`/courses/${courseId}/gradebook`}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Gradebook
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to={`/courses/${courseId}/clinical-assessments`}>
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Clinical Assessments
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to={`/attendance`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Track Attendance
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full justify-start">
                  <Link to={`/courses/${courseId}/assignments`}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Assignments
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to={`/attendance`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    View Attendance
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">
                        {assignment.type} • Due: {new Date(assignment.dueAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{assignment.weight}%</Badge>
                    {assignment.dueAt < Date.now() && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {assignments.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link to={`/courses/${courseId}/assignments/${isTeacher ? 'teacher' : ''}`}>
                    View All Assignments
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


