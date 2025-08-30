import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { saveSubmission, getSubmissionForStudent } from "../lib/submissions";
import { useRole } from "../hooks/useRole";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  X, 
  FileText, 
  CheckCircle, 
  Clock, 
  Award, 
  AlertCircle,
  Calendar,
  Target,
  File,
  Download,
  Eye
} from "lucide-react";
import type { Assignment, Submission } from "../types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

interface AssignmentSubmissionProps {
  assignment: Assignment;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SubmissionFormData {
  fileUrl: string;
  comments?: string;
}

export default function AssignmentSubmission({
  assignment,
  onSuccess,
  onCancel
}: AssignmentSubmissionProps) {
  const { user } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SubmissionFormData>();

  const comments = watch("comments");

  // Check if student already submitted
  useEffect(() => {
    const checkExistingSubmission = async () => {
      if (!user) return;

      try {
        const submission = await getSubmissionForStudent(assignment.id!, user.uid);
        if (submission) {
          setExistingSubmission(submission);
          setValue("fileUrl", submission.fileUrl);
        }
      } catch (error) {
        console.error("Error checking existing submission:", error);
      }
    };

    checkExistingSubmission();
  }, [assignment.id, user, setValue]);

  const onSubmit = async (data: SubmissionFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        assignmentId: assignment.id!,
        courseId: assignment.courseId,
        studentId: user.uid,
        fileUrl: data.fileUrl,
        comments: data.comments || "",
        grade: {
          points: null,
          percent: null,
          feedback: null,
          gradedAt: null,
          graderId: null,
        },
      };

      await saveSubmission(submissionData);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      setAttachments([file]);
      setUploadError(null);
      setIsUploading(true);
      
      try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `submissions/${assignment.courseId}/${assignment.id}/${user?.uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        setValue("fileUrl", downloadURL);
        console.log("File uploaded successfully:", downloadURL);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadError("Failed to upload file. Please try again.");
        // Fallback to filename if upload fails
        setValue("fileUrl", file.name);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachments([file]);
      setUploadError(null);
      setIsUploading(true);
      
      try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `submissions/${assignment.courseId}/${assignment.id}/${user?.uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        setValue("fileUrl", downloadURL);
        console.log("File uploaded successfully:", downloadURL);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadError("Failed to upload file. Please try again.");
        // Fallback to filename if upload fails
        setValue("fileUrl", file.name);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeAttachment = () => {
    setAttachments([]);
    setValue("fileUrl", "");
  };

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case 'hw': return 'Homework';
      case 'quiz': return 'Quiz';
      case 'midterm': return 'Midterm';
      case 'final': return 'Final';

      default: return type;
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'hw': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'quiz': return 'bg-green-100 text-green-700 border-green-200';
      case 'midterm': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'final': return 'bg-red-100 text-red-700 border-red-200';

      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isOverdue = new Date(assignment.dueAt) < new Date();

  if (existingSubmission) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white border-2 border-slate-200 shadow-strong">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-medical-100 to-health-100 rounded-2xl">
              <CheckCircle size={24} className="text-medical-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Assignment Submitted Successfully
              </CardTitle>
              <p className="text-slate-600 mt-1">
                Your submission has been received and is being reviewed
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-vital-50 to-health-50 border border-vital-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 text-vital-800 mb-3">
              <CheckCircle size={20} className="text-vital-600" />
              <span className="font-semibold text-lg">Submission Confirmed</span>
            </div>
            <p className="text-vital-700">
              Submitted on {new Date(existingSubmission.submittedAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} at {new Date(existingSubmission.submittedAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Submission Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* File Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <File size={20} className="text-medical-600" />
                Submission File
              </h4>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-medical-100 rounded-lg">
                    <FileText size={20} className="text-medical-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-medical-800">{existingSubmission.fileUrl}</p>
                    <p className="text-medical-700">Submitted file</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Grading Status */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Award size={20} className="text-alert-600" />
                Grading Status
              </h4>
              {existingSubmission.grade.points !== null ? (
                <div className="bg-gradient-to-r from-medical-50 to-health-50 border border-medical-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-medical-100 rounded-lg">
                      <Award size={20} className="text-medical-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-medical-800 text-lg">
                        {existingSubmission.grade.points} / {assignment.maxPoints} points
                      </p>
                      {existingSubmission.grade.percent !== null && (
                        <p className="text-medical-600 font-medium">
                          {existingSubmission.grade.percent.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                  {existingSubmission.grade.feedback && (
                    <div className="bg-white rounded-lg p-3 border border-medical-200">
                      <p className="text-sm text-medical-800">
                        <strong>Feedback:</strong> {existingSubmission.grade.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-alert-50 to-orange-50 border border-alert-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-alert-100 rounded-lg">
                      <Clock size={20} className="text-alert-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-alert-800">Pending Review</p>
                      <p className="text-alert-700 text-sm">Your submission is being graded</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-slate-200">
            <Button variant="outline" onClick={onCancel} className="px-8">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border-2 border-slate-200 shadow-strong">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-medical-100 to-health-100 rounded-2xl">
            <FileText size={24} className="text-medical-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Submit Assignment
            </CardTitle>
            <p className="text-slate-600 mt-1">
              Upload your completed work for review
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Assignment Details Card */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{assignment.title}</h3>
              <p className="text-slate-600 leading-relaxed">{assignment.instructions}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={`${getAssignmentTypeColor(assignment.type)} px-3 py-1 text-sm font-medium`}>
                {getAssignmentTypeLabel(assignment.type)}
              </Badge>
              {isOverdue && (
                <Badge variant="error" className="px-3 py-1 text-sm font-medium">
                  <Clock size={14} className="mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
          </div>
          
          {/* Assignment Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-slate-500" />
              <span className="text-slate-700">
                <strong>Due:</strong> {new Date(assignment.dueAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target size={16} className="text-slate-500" />
              <span className="text-slate-700">
                <strong>Points:</strong> {assignment.maxPoints}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award size={16} className="text-slate-500" />
              <span className="text-slate-700">
                <strong>Weight:</strong> {assignment.weight}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-slate-500" />
              <span className="text-slate-700">
                <strong>Status:</strong> {isOverdue ? 'Overdue' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-slate-800">
              Assignment File *
            </label>
            
            {/* Drag & Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-medical-400 bg-medical-50'
                  : 'border-slate-300 hover:border-medical-400 hover:bg-medical-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip,.rar"
                className="hidden"
                id="file-upload"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-gradient-to-r from-medical-100 to-health-100 rounded-2xl">
                    <Upload size={32} className="text-medical-600" />
                  </div>
                </div>
                
                <div>
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-medical-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-lg font-medium text-medical-600">Uploading file...</span>
                      </div>
                      <p className="text-sm text-slate-500">Please wait while we upload your file</p>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <p className="text-lg font-medium text-slate-700 mb-2">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-slate-500 mb-4">
                        Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP, RAR
                      </p>
                      <Button variant="outline" className="px-6 py-2">
                        Choose File
                      </Button>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* File Preview */}
            {attachments.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-vital-100 rounded-lg">
                    <FileText size={20} className="text-vital-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{attachments[0].name}</p>
                    <p className="text-sm text-slate-600">
                      {(attachments[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeAttachment}
                    className="text-critical-600 hover:text-critical-700 hover:bg-critical-50"
                  >
                    <X size={16} className="mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="flex items-center gap-2 text-critical-600 bg-critical-50 border border-critical-200 rounded-lg p-3">
                <AlertCircle size={16} />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
            
            {errors.fileUrl && (
              <div className="flex items-center gap-2 text-critical-600 bg-critical-50 border border-critical-200 rounded-lg p-3">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.fileUrl.message}</span>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-slate-800">
              Additional Comments (Optional)
            </label>
            <textarea
              {...register("comments")}
              placeholder="Add any additional notes, explanations, or context for your submission..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-medical-400 focus:outline-none transition-all duration-200 resize-none text-slate-700 placeholder-slate-400"
            />
            <p className="text-sm text-slate-500">
              Use this space to provide context, explain your approach, or note any special circumstances.
            </p>
          </div>

          {/* Hidden field for file URL */}
          <input
            type="hidden"
            {...register("fileUrl", { required: "Please select a file to submit" })}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-8 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || attachments.length === 0}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-medical-600 to-health-600 hover:from-medical-700 hover:to-health-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Submit Assignment
                </>
              )}
            </Button>
          </div>

          {/* Submission Guidelines */}
          <div className="bg-alert-50 border border-alert-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-alert-600 mt-0.5" />
              <div className="text-sm text-alert-800">
                <p className="font-medium mb-1">Submission Guidelines:</p>
                <ul className="space-y-1 text-alert-700">
                  <li>• Ensure your file is complete and properly formatted</li>
                  <li>• Check that you've included all required components</li>
                  <li>• Verify the file opens correctly before submitting</li>
                  <li>• You can only submit once per assignment</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
