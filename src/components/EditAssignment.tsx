import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateAssignment, getCourseWeightUsage, listAssignments } from "../lib/assignments";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  X, 
  Plus, 
  Upload, 
  BookOpen, 
  Target, 
  Award,
  FileText,
  RefreshCw
} from "lucide-react";
import type { Assignment, AssignmentType } from "../types";

interface EditAssignmentFormData {
  title: string;
  type: AssignmentType;
  instructions: string;
  dueAt: string;
  weight: number;
  maxPoints: number;
}

interface EditAssignmentProps {
  assignment: Assignment;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditAssignment({
  assignment,
  onSuccess,
  onCancel
}: EditAssignmentProps) {
  const { user, role } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<string[]>(assignment.attachments || []);
  const [weightUsage, setWeightUsage] = useState<{ total: number; remaining: number } | null>(null);
  const [gradingMode, setGradingMode] = useState<'per-assignment' | 'category'>('per-assignment');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<EditAssignmentFormData>({
    defaultValues: {
      title: assignment.title,
      type: assignment.type,
      instructions: assignment.instructions,
      dueAt: new Date(assignment.dueAt).toISOString().slice(0, 16),
      weight: assignment.weight,
      maxPoints: assignment.maxPoints
    }
  });

  const assignmentType = watch("type");

  // Load weight usage excluding this assignment to get remaining room
  useEffect(() => {
    (async () => {
      try {
        if (!assignment.courseId) return;
        const cDoc = await getDoc(doc(db, 'courses', assignment.courseId));
        if (cDoc.exists()) {
          const cData = cDoc.data() as any;
          if (cData.gradingMode) setGradingMode(cData.gradingMode);
        }
        const all = await listAssignments(assignment.courseId);
        const totalExcluding = all.filter(a => a.id !== assignment.id).reduce((s, a) => s + Number(a.weight || 0), 0);
        const remaining = Math.max(0, 100 - totalExcluding);
        setWeightUsage({ total: totalExcluding, remaining });
      } catch (e) {
        setWeightUsage(null);
      }
    })();
  }, [assignment.id, assignment.courseId]);

  // Check if user has teacher role
  if (role !== 'teacher') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-3xl shadow-glow border border-slate-200/60">
          <div className="p-6">
            <div className="text-center py-16">
              <div className="p-4 bg-critical-50/80 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <X size={32} className="text-critical-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
              <p className="text-slate-600">Only teachers can edit assignments.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: EditAssignmentFormData) => {
    if (!user) return;
    if (!assignment.id) {
      return;
    }

    setIsSubmitting(true);
    try {
      const assignmentData = {
        ...data,
        dueAt: new Date(data.dueAt).getTime(),
        attachments: attachments,
      };

      await updateAssignment(assignment.id, assignmentData);
      onSuccess?.();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments = files.map(file => file.name);
    setAttachments(prev => [...prev, ...newAttachments]);
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
                <RefreshCw size={20} className="text-medical-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Edit Assignment</h2>
                <p className="text-sm text-slate-600">Update assignment details and requirements</p>
              </div>
            </div>
          </div>

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
                        // Remaining here is excluding this assignment's current weight
                        const remaining = weightUsage.remaining + Number(assignment.weight || 0);
                        return Number(v) <= remaining + 1e-6 || `Only ${remaining.toFixed(1)}% available when considering current allocation`;
                      }
                    })}
                    placeholder="10"
                    className={`h-11 bg-white/90 ${errors.weight ? "border-critical-500 focus:border-critical-500" : ""}`}
                  />
                  {gradingMode === 'category' && (
                    <p className="text-xs text-slate-600">Category-based grading is enabled. Assignment weights are managed by category.</p>
                  )}
                  {weightUsage && (
                    <p className="text-xs text-slate-600">Allocated (others): <span className="font-medium">{weightUsage.total.toFixed(1)}%</span> • Available: <span className="font-medium">{(weightUsage.remaining + Number(assignment.weight || 0)).toFixed(1)}%</span> (target total: 100%)</p>
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
                  id="file-upload-edit"
                />
                <label
                  htmlFor="file-upload-edit"
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300/60 rounded-xl cursor-pointer hover:border-vital-400 hover:bg-vital-50/80 transition-all duration-200 bg-white/80"
                >
                  <Upload size={16} className="text-vital-600" />
                  <span className="text-slate-700">Add more files</span>
                </label>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((fileName, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 bg-slate-50/90 rounded-xl border border-slate-200/60"
                      >
                        <div className="p-2 bg-vital-100/80 rounded-lg">
                          <FileText size={16} className="text-vital-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{fileName}</p>
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
                className="px-6 bg-white/80 border-slate-200/60 hover:bg-slate-50/80"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                className="px-6 bg-medical-600 hover:bg-medical-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} className="mr-2" />
                    Update Assignment
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
