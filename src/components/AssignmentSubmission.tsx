import React, { useState, useEffect } from "react";
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
  Eye,
  Link as LinkIcon
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
  links?: string;
  comments?: string;
}

const AssignmentSubmission = React.memo(function AssignmentSubmission({
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
  const [additionalLinks, setAdditionalLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SubmissionFormData>();

  const comments = watch("comments");
  const fileUrl = watch("fileUrl");

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

    // Check if assignment deadline has passed
    const now = Date.now();
    const dueDate = assignment.dueAt;
    if (now > dueDate && !existingSubmission?.canResubmit) {
      setUploadError("The deadline for this assignment has passed. You can no longer submit.");
      return;
    }

    // Validate that at least a file or link is provided
    if (!data.fileUrl && additionalLinks.length === 0) {
      setUploadError("Please upload a file or add at least one link to submit your assignment");
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine comments with links if any
      let fullComments = data.comments || "";
      if (additionalLinks.length > 0) {
        fullComments += "\n\n--- Additional Links ---\n" + additionalLinks.join("\n");
      }

      const submissionData = {
        assignmentId: assignment.id!,
        courseId: assignment.courseId,
        studentId: user.uid,
        fileUrl: data.fileUrl || additionalLinks[0] || "No file attached",
        comments: fullComments,
        submittedAt: Date.now(),
        lastUpdatedAt: Date.now(),
        canResubmit: false, // Lock submission by default
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

  const addLink = () => {
    if (newLink.trim()) {
      setAdditionalLinks([...additionalLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));
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

  if (existingSubmission && !existingSubmission.canResubmit) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white border border-slate-200 shadow-md rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle size={24} className="text-green-600" />
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
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 text-green-800 mb-3">
              <CheckCircle size={20} className="text-green-600" />
              <span className="font-semibold text-lg">Submission Confirmed</span>
            </div>
            <p className="text-green-700">
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
                <File size={20} className="text-blue-600" />
                Submission File
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{existingSubmission.fileUrl}</p>
                    <p className="text-slate-600 text-sm">Submitted file</p>
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
                <Award size={20} className="text-amber-600" />
                Grading Status
              </h4>
              {existingSubmission.grade.points !== null ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-lg">
                        {existingSubmission.grade.points} / {assignment.maxPoints} points
                      </p>
                      {existingSubmission.grade.percent !== null && (
                        <p className="text-blue-600 font-medium">
                          {existingSubmission.grade.percent.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                  {existingSubmission.grade.feedback && (
                    <div className="bg-white border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-slate-800">
                        <strong>Feedback:</strong> {existingSubmission.grade.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">Pending Review</p>
                      <p className="text-amber-700 text-sm">Your submission is being graded</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission Status Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Submission Locked</p>
                <p className="text-blue-800">
                  Your submission has been locked. You cannot edit or resubmit unless your teacher allows it.
                  If you need to make changes, please contact your instructor.
                </p>
              </div>
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

  // If student already submitted but teacher allowed resubmission
  if (existingSubmission && existingSubmission.canResubmit) {
    // Pre-fill the form with existing submission data
    if (existingSubmission.fileUrl && !attachments.length) {
      // Note: We can't pre-fill file input, but we can show the previous submission info
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border border-slate-200 shadow-md rounded-2xl">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              {existingSubmission?.canResubmit ? 'Resubmit Assignment' : 'Submit Assignment'}
            </CardTitle>
            <p className="text-slate-600 mt-1">
              {existingSubmission?.canResubmit
                ? 'Your teacher has allowed you to resubmit this assignment'
                : 'Upload your completed work for review'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Resubmission Notice */}
        {existingSubmission?.canResubmit && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">Resubmission Allowed</p>
                <p className="text-amber-800 mb-2">
                  Your teacher has enabled resubmission for this assignment. You can update your previous submission.
                </p>
                {existingSubmission.resubmissionNote && (
                  <div className="bg-white/50 rounded-lg p-3 mt-2">
                    <p className="font-medium text-amber-900 text-xs mb-1">Note from Teacher:</p>
                    <p className="text-amber-800">{existingSubmission.resubmissionNote}</p>
                  </div>
                )}
                {existingSubmission.submittedAt && (
                  <p className="text-amber-700 text-xs mt-2">
                    Previous submission: {new Date(existingSubmission.submittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Assignment Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
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
              Assignment File (Optional)
            </label>
            <p className="text-sm text-slate-600">
              Upload a file or provide links below. At least one is required.
            </p>
            
            {/* Drag & Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
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
                  <div className="p-4 bg-blue-100 rounded-xl">
                    <Upload size={32} className="text-blue-600" />
                  </div>
                </div>
                
                <div>
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-lg font-medium text-blue-600">Uploading file...</span>
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
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText size={20} className="text-green-600" />
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
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={16} className="mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={16} />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}

            {errors.fileUrl && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.fileUrl.message}</span>
              </div>
            )}
          </div>

          {/* Additional Links Section */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-slate-800">
              Submission Links (Optional)
            </label>
            <p className="text-sm text-slate-600 mb-3">
              Add links to Google Drive, GitHub, OneDrive, or any online submission. You can submit with links only.
            </p>

            <div className="flex gap-2">
              <Input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com or https://drive.google.com/..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addLink}
                variant="outline"
                disabled={!newLink.trim()}
              >
                <LinkIcon size={16} className="mr-2" />
                Add Link
              </Button>
            </div>

            {/* Display added links */}
            {additionalLinks.length > 0 && (
              <div className="space-y-2 mt-4">
                {additionalLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3"
                  >
                    <LinkIcon size={16} className="text-blue-600 flex-shrink-0" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm text-blue-700 hover:text-blue-900 hover:underline truncate"
                    >
                      {link}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none text-slate-700 placeholder-slate-400"
            />
            <p className="text-sm text-slate-500">
              Use this space to provide context, explain your approach, or note any special circumstances.
            </p>
          </div>

          {/* Hidden field for file URL - no longer required */}
          <input
            type="hidden"
            {...register("fileUrl")}
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
              disabled={isSubmitting || isUploading || (attachments.length === 0 && additionalLinks.length === 0)}
              className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-2">Submission Guidelines:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• <strong>File or link required</strong> - You must upload a file OR add at least one link</li>
                  <li>• You can submit via file upload, links (Google Drive, GitHub, etc.), or both</li>
                  <li>• Ensure your submission is complete and properly formatted</li>
                  <li>• For link submissions, verify the sharing permissions are set correctly</li>
                  <li>• Check that you&apos;ve included all required components</li>
                  <li>• <strong>No submissions after deadline</strong> - You cannot submit after the due date</li>
                  <li>• Once submitted, you cannot edit unless your teacher allows resubmission</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

export default AssignmentSubmission;
