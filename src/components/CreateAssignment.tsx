import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createAssignment, getCourseWeightUsage } from "../lib/assignments";
import { getTeacherAssignments, debugTeacherAssignments, checkTeacherAssignments, type TeacherAssignment } from "../lib/teacherAssignments";
import { checkDatabase, checkUser, checkCourses, enrollUser, assignTeacher } from "../lib/databaseDebug";
import { useRole } from "../hooks/useRole";
import { getAllUsers } from "../lib/users";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  X, 
  Plus, 
  Upload, 
  AlertCircle, 
  BookOpen, 
  Calendar, 
  Target, 
  Award,
  FileText,
  Clock,
  RefreshCw,
  Search,
  Info
} from "lucide-react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { AssignmentType } from "../types";

interface CreateAssignmentFormData {
  title: string;
  type: AssignmentType;
  instructions: string;
  dueAt: string;
  weight: number;
  maxPoints: number;
  courseId: string;
}

interface CreateAssignmentProps {
  courseId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FallbackCourse {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  semester: string;
  teacherEmail: string | null;
  teacherId: string;
}

export default function CreateAssignment({
  courseId,
  onSuccess,
  onCancel
}: CreateAssignmentProps) {
  const { user, role } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseId || "");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<Array<TeacherAssignment & { id: string }> | FallbackCourse[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weightUsage, setWeightUsage] = useState<{ total: number; remaining: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CreateAssignmentFormData>({
    defaultValues: {
      type: "hw",
      weight: 10,
      maxPoints: 100
    }
  });

  const assignmentType = watch("type");
  const selectedCourseData = teacherCourses.find(c => c.courseId === selectedCourse);
  const [gradingMode, setGradingMode] = useState<'per-assignment' | 'category'>('per-assignment');

  // Load current weight usage for the selected course
  useEffect(() => {
    const cid = courseId || selectedCourse;
    if (!cid) { setWeightUsage(null); return; }
    (async () => {
      try {
        // Load grading mode
        const cDoc = await getDoc(doc(db, 'courses', cid));
        if (cDoc.exists()) {
          const cData = cDoc.data() as any;
          if (cData.gradingMode) setGradingMode(cData.gradingMode);
        }
        const usage = await getCourseWeightUsage(cid);
        setWeightUsage(usage);
      } catch (e) {
        setWeightUsage(null);
      }
    })();
  }, [courseId, selectedCourse]);

  // Function to load teacher's courses
  const loadCourses = async () => {
    if (!courseId && user && role === 'teacher') {
      try {

        // Debug: Check what's in the teacher assignments collection
        await debugTeacherAssignments();

        // First, get the user's Firestore document ID
        const allUsers = await getAllUsers();
        
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
        
        if (!currentUser?.id) {
          setTeacherCourses([]);
          setIsRefreshing(false);
          return;
        }


        // Get teacher assignments using the Firestore document ID
        const courses = await getTeacherAssignments(currentUser.id);
        
        // Also try the simpler query function
        const simpleCourses = await checkTeacherAssignments(currentUser.id);
        
        // Also check if there are any teacher assignments at all in the collection
        const allTeacherAssignments = await debugTeacherAssignments();
        
        // Check if any assignments match this teacher's ID
        const matchingAssignments = allTeacherAssignments.filter(a => a.teacherId === currentUser.id);
        
        // Debug: Check the structure of teacher assignments
        if (allTeacherAssignments.length > 0) {
        }

        // Also check enrollments for this teacher (in case they're enrolled as students)
        const enrollmentsQuery = query(
          collection(db, "enrollments"),
          where("studentId", "==", currentUser.id), // Use Firestore document ID
          where("status", "==", "enrolled")
        );
        const enrollmentsSnap = await getDocs(enrollmentsQuery);
        const enrollments = enrollmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let finalCourses: Array<TeacherAssignment & { id: string }> | FallbackCourse[] = courses;

        // If no teacher assignments found, try the simple query results
        if (courses.length === 0 && simpleCourses.length > 0) {
          finalCourses = simpleCourses;
        }

        // If still no courses found, check if teacher is enrolled in any courses
        if (finalCourses.length === 0 && enrollments.length > 0) {
          // Get course details for enrolled courses
          const coursesCollection = collection(db, "courses");
          const enrolledCourses: FallbackCourse[] = [];

          for (const enrollment of enrollments) {
            try {
              const courseDoc = await getDocs(query(coursesCollection, where("id", "==", (enrollment as any).courseId)));
              if (!courseDoc.empty) {
                const courseData = courseDoc.docs[0].data();
                enrolledCourses.push({
                  id: courseDoc.docs[0].id,
                  courseId: (enrollment as any).courseId,
                  courseCode: courseData.code,
                  courseTitle: courseData.title,
                  semester: courseData.semester,
                  teacherEmail: user.email,
                  teacherId: currentUser.id // Use Firestore document ID
                });
              }
            } catch (error) {
            }
          }

          finalCourses = enrolledCourses;
        }

        if (finalCourses.length === 0) {

          // Make debug functions globally available
          if (typeof window !== 'undefined') {
            (window as any).checkDatabase = checkDatabase;
            (window as any).checkUser = checkUser;
            (window as any).checkCourses = checkCourses;
            (window as any).enrollUser = enrollUser;
            (window as any).assignTeacher = assignTeacher;
          }
        }

        setTeacherCourses(finalCourses);
        setIsRefreshing(false);
      } catch (error) {
        setIsRefreshing(false);
      }
    }
  };

  // Load teacher's courses if no courseId provided - ALWAYS call this hook
  useEffect(() => {
    loadCourses();
  }, [courseId, user, role]);

  // Check if user has teacher role (but wait for role to load first)
  if (role !== undefined && role !== 'teacher') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-3xl shadow-glow border border-slate-200/60">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-critical-100/90 rounded-xl">
                  <AlertCircle size={20} className="text-critical-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
                  <p className="text-sm text-slate-600">Only teachers can create assignments</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="bg-critical-50/90 border border-critical-200/60 rounded-2xl p-6 text-center">
              <p className="text-critical-700 mb-4">
                Your current role is: <strong className="text-critical-800">{role || 'Not detected'}</strong>
              </p>
              <p className="text-critical-600 text-sm mb-6">
                If you believe this is an error, please contact an administrator.
              </p>
              <Button variant="outline" onClick={onCancel} className="px-6">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while role is being determined
  if (role === undefined) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-3xl shadow-glow border border-slate-200/60">
          <div className="p-6">
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-medical-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-600 text-lg">Loading user permissions...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CreateAssignmentFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const assignmentData = {
        ...data,
        courseId: selectedCourse || data.courseId,
        dueAt: new Date(data.dueAt).getTime(),
        attachments: attachments.map(file => file.name), // In a real app, you'd upload files to storage
      };

      await createAssignment(assignmentData);
      onSuccess?.();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const assignmentTypeOptions: { value: AssignmentType; label: string; color: string; icon: any }[] = [
    { value: "hw", label: "Homework", color: "bg-medical-100 text-medical-700 border-medical-200", icon: BookOpen },
    { value: "quiz", label: "Quiz", color: "bg-vital-100 text-vital-700 border-vital-200", icon: Target },
    { value: "midterm", label: "Midterm", color: "bg-alert-100 text-alert-700 border-alert-200", icon: Award },
    { value: "final", label: "Final", color: "bg-critical-100 text-critical-700 border-critical-200", icon: Award },

  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/95 rounded-3xl shadow-glow border border-slate-200/60">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-medical-100 to-health-100 rounded-xl">
                <Plus size={20} className="text-medical-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Create New Assignment</h2>
                <p className="text-sm text-slate-600">Set up a new assignment for your students</p>
              </div>
            </div>
          </div>

          {/* Course Selection (if not provided) */}
          {!courseId && (
            <div className="mb-6 p-4 bg-slate-50/90 border border-slate-200/60 rounded-2xl">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Select Course *
                </label>
                {teacherCourses.length > 0 ? (
                  <div className="space-y-3">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200/60 rounded-xl focus:border-medical-400 focus:outline-none transition-all duration-200 text-slate-700 bg-white/90"
                      required
                    >
                      <option value="">Choose a course to create assignment for...</option>
                      {teacherCourses.map((course) => (
                        <option key={course.courseId} value={course.courseId}>
                          {course.courseCode} - {course.courseTitle}
                        </option>
                      ))}
                    </select>
                    
                    {selectedCourseData && (
                      <div className="bg-medical-50/90 border border-medical-200/60 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-medical-100/80 rounded-lg">
                            <BookOpen size={20} className="text-medical-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-medical-800">{selectedCourseData.courseCode}</p>
                            <p className="text-medical-700">{selectedCourseData.courseTitle}</p>
                            <p className="text-medical-600 text-sm">Semester: {selectedCourseData.semester}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-critical-50/90 border border-critical-200/60 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-critical-100/80 rounded-lg">
                        <AlertCircle size={20} className="text-critical-600" />
                      </div>
                      <div>
                        <p className="text-critical-700 font-semibold">No Courses Available</p>
                        <p className="text-critical-600 text-sm">You need to be assigned to courses before creating assignments</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/90 border border-critical-200/60 rounded-xl p-3">
                        <p className="text-critical-800 text-sm font-medium mb-2">
                          🔧 <strong>Solutions:</strong>
                        </p>
                        <div className="text-critical-700 text-sm space-y-1">
                          <p>• Open browser console (F12) and run: <code className="bg-critical-100/60 px-2 py-1 rounded">checkDatabase()</code></p>
                          <p>• Check available courses: <code className="bg-critical-100/60 px-2 py-1 rounded">checkCourses()</code></p>
                          <p>• Contact admin to assign you to courses via Manage Users</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsRefreshing(true);
                            loadCourses();
                          }}
                          disabled={isRefreshing}
                          className="flex-1 sm:flex-none"
                        >
                          {isRefreshing ? (
                            <>
                              <RefreshCw size={16} className="mr-2 animate-spin" />
                              Refreshing...
                            </>
                          ) : (
                            <>
                              <RefreshCw size={16} className="mr-2" />
                              Refresh
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              (window as any).checkDatabase();
                              (window as any).checkUser(user?.uid);
                              (window as any).checkCourses();
                            }
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Search size={16} className="mr-2" />
                          Debug
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Assignment Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-medical-600" />
                Assignment Details
              </h3>
              
              {/* Title and Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Assignment Title *
                  </label>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g., Chapter 5 Problem Set"
                                         className={`h-11 bg-white/90 ${errors.title ? "border-critical-500 focus:border-critical-500" : ""}`}
                  />
                  {errors.title && (
                    <p className="text-critical-500 text-sm">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Assignment Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {assignmentTypeOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setValue("type", option.value)}
                          className={`p-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center ${
                            assignmentType === option.value
                              ? `${option.color} border-current shadow-md scale-105`
                              : "border-slate-200/60 text-slate-700 hover:border-medical-300 hover:bg-medical-50/80 bg-white/80"
                          }`}
                        >
                          <IconComponent size={16} />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Instructions *
                </label>
                <textarea
                  {...register("instructions", { required: "Instructions are required" })}
                  placeholder="Provide clear instructions for students on what to complete, how to submit, and any specific requirements..."
                  rows={4}
                                     className={`w-full px-3 py-3 border-2 border-slate-200/60 rounded-xl focus:border-medical-400 focus:outline-none transition-colors resize-none bg-white/90 ${
                     errors.instructions ? "border-critical-500 focus:border-critical-500" : ""
                   }`}
                />
                {errors.instructions && (
                  <p className="text-critical-500 text-sm">{errors.instructions.message}</p>
                )}
              </div>
            </div>

            {/* Grading & Due Date Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Award size={20} className="text-alert-600" />
                Grading & Due Date
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Due Date & Time *
                  </label>
                  <Input
                    type="datetime-local"
                    {...register("dueAt", { required: "Due date is required" })}
                                         className={`h-11 bg-white/90 ${errors.dueAt ? "border-critical-500 focus:border-critical-500" : ""}`}
                  />
                  {errors.dueAt && (
                    <p className="text-critical-500 text-sm">{errors.dueAt.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Max Points *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    {...register("maxPoints", {
                      required: "Max points is required",
                      min: { value: 1, message: "Must be at least 1 point" },
                      max: { value: 1000, message: "Cannot exceed 1000 points" }
                    })}
                    placeholder="100"
                                         className={`h-11 bg-white/90 ${errors.maxPoints ? "border-critical-500 focus:border-critical-500" : ""}`}
                  />
                  {errors.maxPoints && (
                    <p className="text-critical-500 text-sm">{errors.maxPoints.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Weight (%) *
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    disabled={gradingMode === 'category'}
                    {...register("weight", {
                      required: "Weight is required",
                      min: { value: 0, message: "Weight must be positive" },
                      max: { value: 100, message: "Weight cannot exceed 100%" },
                      validate: (v) => {
                        if (gradingMode === 'category') return true;
                        if (!weightUsage) return true;
                        const remaining = weightUsage.remaining;
                        return Number(v) <= remaining + 1e-6 || `Only ${remaining.toFixed(1)}% remaining in this course`;
                      }
                    })}
                    placeholder="10"
                                         className={`h-11 bg-white/90 ${errors.weight ? "border-critical-500 focus:border-critical-500" : ""}`}
                  />
                  {gradingMode === 'category' && (
                    <p className="text-xs text-slate-600">Category-based grading is enabled for this course. Assignment weights are managed by category.</p>
                  )}
                  {weightUsage && (
                    <p className="text-xs text-slate-600">Used: <span className="font-medium">{weightUsage.total.toFixed(1)}%</span> • Remaining: <span className="font-medium">{weightUsage.remaining.toFixed(1)}%</span> (target total: 100%)</p>
                  )}
                  {errors.weight && (
                    <p className="text-critical-500 text-sm">{errors.weight.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Upload size={20} className="text-vital-600" />
                Supporting Materials (Optional)
              </h3>
              
              <div className="space-y-3">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip,.rar"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300/60 rounded-xl cursor-pointer hover:border-vital-400 hover:bg-vital-50/80 transition-all duration-200 bg-white/80"
                >
                  <Upload size={16} className="text-vital-600" />
                  <span className="text-slate-700">Choose files to attach</span>
                </label>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 bg-slate-50/90 rounded-xl border border-slate-200/60"
                      >
                        <div className="p-2 bg-vital-100/80 rounded-lg">
                          <FileText size={16} className="text-vital-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{file.name}</p>
                          <p className="text-sm text-slate-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          className="text-critical-600 hover:text-critical-700 hover:bg-critical-50/80"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (!selectedCourse && !courseId)}
                variant="primary"
                className="px-6"
                title={
                  !selectedCourse && !courseId
                    ? "Please select a course first"
                    : isSubmitting
                    ? "Creating assignment..."
                    : "Create Assignment"
                }
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Create Assignment
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
