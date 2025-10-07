import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { getAllUsers } from "../lib/users";
import { getSubmissionForStudent } from "../lib/submissions";
import { getCourseWeightUsage } from "../lib/assignments";
import { updateCourse as secureUpdateCourse } from "../lib/coursesSecure";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
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
  BarChart3,
  Target,
  CheckCircle
} from "lucide-react";
import type { Course, User, Assignment, Enrollment, Submission } from "../types";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { role, user } = useRole();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [studentGradeData, setStudentGradeData] = useState<{
    overallGrade: number;
    submittedCount: number;
    gradedCount: number;
    pendingCount: number;
  } | null>(null);
  const [weightUsage, setWeightUsage] = useState<{ total: number; remaining: number } | null>(null);
  const [gradingMode, setGradingMode] = useState<'per-assignment' | 'category'>('per-assignment');
  const [categoryWeights, setCategoryWeights] = useState<Partial<Record<Assignment["type"], number>>>({});
  const [isFinalized, setIsFinalized] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const rolePrimary = role === 'admin'
    ? 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
    : role === 'teacher'
      ? 'from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
      : 'from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700';

  useEffect(() => {
    if (courseId) {
      // Scroll to top when page loads
      window.scrollTo({ top: 0, behavior: 'auto' });
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

      // For students, calculate their grade in this course (initial)
      if (role === 'student' && user && assignmentsData.length > 0) {
        await calculateStudentGrade(assignmentsData, user.uid);
      }

      // Load grading metadata (mode, category weights, weight usage, finalized)
      if (courseId) {
        const cDoc = await getDoc(doc(db, 'courses', courseId));
        if (cDoc.exists()) {
          const cData = cDoc.data() as any;
          if (cData.gradingMode) setGradingMode(cData.gradingMode);
          if (cData.categoryWeights) setCategoryWeights(cData.categoryWeights);
          if (typeof cData.gradingFinalized === 'boolean') setIsFinalized(cData.gradingFinalized);
        }
        try {
          const usage = await getCourseWeightUsage(courseId);
          setWeightUsage(usage);
        } catch (e) {
          console.error('Error loading weight usage:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recalculate when scheme or assignments change (ensures correct totals)
  useEffect(() => {
    if (role === 'student' && user && assignments.length > 0) {
      calculateStudentGrade(assignments, user.uid);
    }
  }, [gradingMode, categoryWeights, assignments, role, user]);

  const calculateStudentGrade = async (courseAssignments: Assignment[], studentUid: string) => {
    try {
      let submittedCount = 0;
      let gradedCount = 0;
      let pendingCount = 0;

      if (gradingMode === 'category' && Object.keys(categoryWeights || {}).length > 0) {
        // Map category -> percents of graded submissions
        const byCat: Record<string, number[]> = {};
        for (const a of courseAssignments) {
          const sub = await getSubmissionForStudent(a.id!, studentUid);
          if (sub) {
            submittedCount++;
            if (sub.grade.gradedAt && sub.grade.points !== null) {
              gradedCount++;
              const pct = (sub.grade.points / a.maxPoints) * 100;
              const cat = a.type;
              if (!byCat[cat]) byCat[cat] = [];
              byCat[cat].push(pct);
            } else {
              pendingCount++;
            }
          }
        }
        // Normalize weights: support either 0..1 or 0..100 inputs
        const rawCatSum = Object.values(categoryWeights).reduce((s, v: any) => s + Number(v || 0), 0);
        const factor = rawCatSum > 0 && rawCatSum <= 1.5 ? 100 : 1; // treat <=1 as fractional
        let weighted = 0;
        let totalCatWeight = 0;
        for (const [cat, w] of Object.entries(categoryWeights)) {
          const wNum = Number(w || 0) * factor;
          if (wNum <= 0) continue;
          totalCatWeight += wNum;
          const arr = byCat[cat] || [];
          const avg = arr.length > 0 ? (arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
          weighted += avg * wNum;
        }
        const overall = totalCatWeight > 0 ? (weighted / totalCatWeight) : 0;
        setStudentGradeData({
          overallGrade: overall,
          submittedCount,
          gradedCount,
          pendingCount
        });
        return;
      }

      // Per-assignment mode
      // Normalize weights: support either 0..1 or 0..100 inputs
      const rawSum = courseAssignments.reduce((s, a) => s + Number((a as any).weight || 0), 0);
      const factor = rawSum > 0 && rawSum <= 1.5 ? 100 : 1;
      let totalWeight = 0;
      let totalWeightedPercentage = 0;
      for (const assignment of courseAssignments) {
        const submission = await getSubmissionForStudent(assignment.id!, studentUid);
        if (submission) {
          submittedCount++;
          if (submission.grade.gradedAt && submission.grade.points !== null) {
            gradedCount++;
            const percent = (submission.grade.points / assignment.maxPoints) * 100;
            const w = Number(assignment.weight || 0) * factor;
            totalWeightedPercentage += percent * w;
            totalWeight += w;
          } else {
            pendingCount++;
          }
        }
      }
      const overallGrade = totalWeight > 0 ? (totalWeightedPercentage / totalWeight) : 0;
      setStudentGradeData({ overallGrade, submittedCount, gradedCount, pendingCount });
    } catch (error) {
      console.error('Error calculating student grade:', error);
    }
  };

  const saveCategoryWeights = async () => {
    if (!courseId) return;
    const sum = Object.values(categoryWeights || {}).reduce((s, n) => s + Number(n || 0), 0);
    if (Math.abs(sum - 100) > 1e-6) {
      alert('Category weights must sum to 100%');
      return;
    }
    try {
      await secureUpdateCourse(courseId, {
        code: course!.code,
        title: course!.title,
        credits: course!.credits,
        semester: course!.semester,
        instructor: course!.instructor,
        description: course!.description,
      } as any);
      // Save via direct update to attach custom fields (gradingMode, categoryWeights)
      await updateDoc(doc(db, 'courses', courseId), {
        gradingMode: 'category',
        categoryWeights: categoryWeights
      });
      setGradingMode('category');
    } catch (e) {
      console.error('Error saving category weights:', e);
      alert('Failed to save grading scheme.');
    }
  };

  const finalizeCourse = async () => {
    if (!courseId) return;
    if (gradingMode === 'category') {
      const sum = Object.values(categoryWeights || {}).reduce((s, n) => s + Number(n || 0), 0);
      if (Math.abs(sum - 100) > 1e-6) {
        alert('Cannot finalize: category weights must sum to 100%.');
        return;
      }
    } else if (weightUsage && Math.abs(weightUsage.total - 100) > 1e-6) {
      alert('Cannot finalize: assignment weights must total 100%.');
      return;
    }
    try {
      await updateDoc(doc(db, 'courses', courseId), { gradingFinalized: true });
      setIsFinalized(true);
    } catch (e) {
      console.error('Error finalizing course:', e);
      alert('Failed to finalize course.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-teal-100 rounded-3xl mb-6 shadow-soft">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">Loading Course Details...</h3>
          <p className="text-slate-600">Please wait while we fetch the course information</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 animate-fade-in">
        <div className="bg-gradient-to-br from-red-50/80 to-orange-50/80 border border-red-200/60 rounded-2xl p-8 shadow-soft text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl mb-4">
            <BookOpen size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Course Not Found</h3>
          <p className="text-red-700">The requested course could not be found or may have been removed.</p>
        </div>
      </div>
    );
  }

  const isTeacher = role === 'teacher' || role === 'admin';
  const totalStudents = enrollments.length;
  const totalAssignments = assignments.length;
  const upcomingAssignments = assignments.filter(a => a.dueAt > Date.now()).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-50/80 to-teal-50/80 rounded-2xl border border-blue-200/30 shadow-soft">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl shadow-soft">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{course.title}</h1>
            <div className="flex items-center gap-3 mt-3">
              <Badge className="bg-blue-100 text-blue-700 px-3 py-1 font-semibold">{course.code}</Badge>
              <Badge className="bg-green-100 text-green-700 px-3 py-1 font-semibold">{course.semester}</Badge>
              <Badge className="bg-slate-100 text-slate-700 px-3 py-1 font-semibold">{course.credits} credit{course.credits !== 1 ? 's' : ''}</Badge>
            </div>
          </div>
        </div>
        {/* Header actions removed; moved to Action Bar below */}
      </div>

      {/* Course Action Bar - below header */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isTeacher ? (
          <>
            <Button asChild className={`h-12 justify-center bg-gradient-to-r ${rolePrimary} text-white shadow-sm`}>
              <Link to={`/courses/${courseId}/assignments/teacher`}>
                <FileText className="w-5 h-5 mr-2" />
                Manage Assignments
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-12 justify-center border-slate-300">
              <Link to={`/courses/${courseId}/enrollments`}>
                <Users className="w-5 h-5 mr-2" />
                Manage Enrollments
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-12 justify-center border-slate-300">
              <Link to={`/courses/${courseId}/clinical-assessments`}>
                <Stethoscope className="w-5 h-5 mr-2" />
                Clinical Assessments
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 justify-center border-slate-300">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Grading Scheme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl bg-white/95 border border-slate-200/60 sm:rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Grading Scheme</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="text-sm text-slate-700">Mode:</div>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" checked={gradingMode === 'per-assignment'} onChange={() => setGradingMode('per-assignment')} />
                        Per-assignment {weightUsage ? `(used ${weightUsage.total.toFixed(1)}%, remaining ${weightUsage.remaining.toFixed(1)}%)` : ''}
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" checked={gradingMode === 'category'} onChange={() => setGradingMode('category')} />
                        Category-based
                      </label>
                    </div>
                  </div>
                  {gradingMode === 'category' ? (
                    <div className="space-y-3">
                      <div className="text-sm text-slate-600">Set category weights to total 100%.</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['quiz','homework','hw','midterm','final','presentation'].map((cat) => (
                          <div key={cat} className="flex items-center justify-between p-3 border rounded-xl">
                            <span className="capitalize text-slate-700">{cat}</span>
                            <input type="number" min={0} max={100} step={0.5}
                              value={Number((categoryWeights as any)[cat] || 0)}
                              onChange={(e) => setCategoryWeights(prev => ({ ...prev, [cat]: Number(e.target.value) }))}
                              className="w-24 h-10 border-2 border-slate-200 rounded-lg px-2" />
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-slate-600">Total: <span className="font-semibold">{Object.values(categoryWeights || {}).reduce((s: number, n: any) => s + Number(n || 0), 0).toFixed(1)}%</span></div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="h-11" onClick={saveCategoryWeights}>Save</Button>
                        <Button className="h-11" disabled={(() => { const t = Object.values(categoryWeights || {}).reduce((s: number, n: any) => s + Number(n || 0), 0); return Math.abs(t - 100) > 1e-6; })()} onClick={finalizeCourse}>Finalize</Button>
                      </div>
                      {isFinalized && <div className="text-green-700 text-sm">Course grading has been finalized.</div>}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-700">Total assignment weight used: <span className="font-semibold">{weightUsage ? weightUsage.total.toFixed(1) : '0.0'}%</span> (remaining {weightUsage ? weightUsage.remaining.toFixed(1) : '100.0'}%)</div>
                      <div className="flex gap-3">
                        <Button className="h-11" disabled={!weightUsage || Math.abs((weightUsage?.total || 0) - 100) > 1e-6} onClick={finalizeCourse}>Finalize</Button>
                      </div>
                      {isFinalized && <div className="text-green-700 text-sm">Course grading has been finalized.</div>}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            <Button asChild className={`h-12 justify-center bg-gradient-to-r ${rolePrimary} text-white shadow-sm`}>
              <Link to={`/courses/${courseId}/assignments`}>
                <FileText className="w-5 h-5 mr-2" />
                View Assignments
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-12 justify-center border-slate-300">
              <Link to={`/attendance`}>
                <Calendar className="w-5 h-5 mr-2" />
                View Attendance
              </Link>
            </Button>
          </>
        )}
      </div>

      {/* Course Stats - Different for Students vs Teachers */}
      {isTeacher ? (
        // Teacher/Admin View
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 border border-blue-200/30 shadow-soft transition-colors duration-200 interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Enrolled Students</p>
                  <p className="text-3xl font-bold text-blue-700">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/80 to-green-100/50 border border-green-200/30 shadow-soft transition-colors duration-200 interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Assignments</p>
                  <p className="text-3xl font-bold text-green-700">{totalAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50/80 to-yellow-100/50 border border-yellow-200/30 shadow-soft transition-colors duration-200 interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Upcoming</p>
                  <p className="text-3xl font-bold text-yellow-700">{upcomingAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50/80 to-purple-100/50 border border-purple-200/30 shadow-soft transition-colors duration-200 interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-md">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completion Rate</p>
                  <p className="text-3xl font-bold text-purple-700">{totalAssignments > 0 ? Math.round((totalAssignments - upcomingAssignments) / totalAssignments * 100) : 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Student View - Show Grade Information
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 border border-blue-200/30 shadow-soft transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-md">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Overall Grade</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {studentGradeData ? `${studentGradeData.overallGrade.toFixed(1)}%` : 'N/A'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Weighted by assignment weights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/80 to-green-100/50 border border-green-200/30 shadow-soft transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Graded</p>
                  <p className="text-3xl font-bold text-green-700">
                    {studentGradeData ? studentGradeData.gradedCount : 0}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    of {totalAssignments} assignments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50/80 to-yellow-100/50 border border-yellow-200/30 shadow-soft transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>

      
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-700">
                    {studentGradeData ? studentGradeData.pendingCount : 0}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">awaiting grade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50/80 to-purple-100/50 border border-purple-200/30 shadow-soft transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-md">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Submitted</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {studentGradeData ? studentGradeData.submittedCount : 0}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {totalAssignments > 0 ? Math.round(((studentGradeData?.submittedCount || 0) / totalAssignments) * 100) : 0}% complete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Details */}
        <Card className="lg:col-span-2 bg-white/95 border border-slate-200/60 shadow-soft transition-colors duration-200">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Course Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-50/80 to-blue-50/20 rounded-2xl border border-slate-200/30">
              <h3 className="font-semibold text-slate-800 mb-3">Description</h3>
              <p className="text-slate-700 leading-relaxed">{course.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50/80 to-teal-50/40 rounded-2xl border border-blue-200/30">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Course Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Code:</span>
                    <Badge className="bg-blue-100 text-blue-700">{course.code}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Credits:</span>
                    <Badge className="bg-slate-100 text-slate-700">{course.credits}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Semester:</span>
                    <Badge className="bg-green-100 text-green-700">{course.semester}</Badge>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50/80 to-indigo-50/40 rounded-2xl border border-purple-200/30">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Instructor
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Name:</span>
                    <span className="font-semibold text-slate-800">{instructor?.name || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Email:</span>
                    <span className="font-medium text-slate-700">{instructor?.email || 'TBD'}</span>
                  </div>
                  {instructor?.department && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Department:</span>
                      <span className="font-medium text-slate-700">{instructor.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/95 border border-slate-200/60 shadow-soft transition-colors duration-200">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTeacher ? (
              <>
                <Button asChild className={`w-full justify-start h-12 bg-gradient-to-r ${rolePrimary} text-white shadow-sm transition-colors duration-200`}>
                  <Link to={`/courses/${courseId}/assignments/teacher`}>
                    <FileText className="w-5 h-5 mr-3" />
                    Manage Assignments
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start h-12 border-slate-300 hover:bg-slate-50 shadow-sm transition-colors duration-200">
                  <Link to={`/courses/${courseId}/gradebook`}>
                    <BarChart3 className="w-5 h-5 mr-3" />
                    View Gradebook
                  </Link>
                </Button>
                <Button asChild className={`w-full justify-start h-12 bg-gradient-to-r ${rolePrimary} text-white shadow-sm transition-colors duration-200`}>
                  <Link to={`/courses/${courseId}/clinical-assessments`}>
                    <Stethoscope className="w-5 h-5 mr-3" />
                    Clinical Assessments
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start h-12 border-slate-300 hover:bg-slate-50 shadow-sm transition-colors duration-200">
                  <Link to={`/attendance`}>
                    <Calendar className="w-5 h-5 mr-3" />
                    Track Attendance
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className={`w-full justify-start h-12 bg-gradient-to-r ${rolePrimary} text-white shadow-sm transition-colors duration-200`}>
                  <Link to={`/courses/${courseId}/assignments`}>
                    <FileText className="w-5 h-5 mr-3" />
                    View Assignments
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start h-12 border-slate-300 hover:bg-slate-50 shadow-sm transition-colors duration-200">
                  <Link to={`/attendance`}>
                    <Calendar className="w-5 h-5 mr-3" />
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
        <Card className="bg-white/95 border border-slate-200/60 shadow-soft transition-colors duration-200">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Recent Assignments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-5 bg-gradient-to-br from-slate-50/80 to-blue-50/20 rounded-2xl border border-slate-200/30 transition-colors duration-200 interactive">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-base">{assignment.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-medium">{assignment.type}</span> • Due: {new Date(assignment.dueAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 font-semibold">{assignment.weight}%</Badge>
                    {assignment.dueAt < Date.now() && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 font-semibold">Overdue</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {assignments.length > 5 && (
              <div className="mt-8 text-center">
                <Button variant="outline" asChild className="h-12 px-8 border-slate-300 hover:bg-slate-50 shadow-sm transition-colors duration-200">
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


