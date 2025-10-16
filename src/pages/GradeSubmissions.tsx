import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  Award, 
  Clock, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare
} from "lucide-react";
import type { Submission, Assignment } from "../types";

interface GradingFormData {
  points: string;
  feedback: string;
}

export default function GradeSubmissions() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { role } = useRole();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<string | null>(null);
  const [gradingForm, setGradingForm] = useState<GradingFormData>({ points: '', feedback: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!assignmentId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch assignment details
        const assignmentRef = doc(db, "assignments", assignmentId);
        const assignmentDoc = await getDoc(assignmentRef);

        if (assignmentDoc.exists()) {
          const assignmentData = assignmentDoc.data() as Assignment;
          setAssignment({ id: assignmentDoc.id, ...assignmentData });
        } else {
          setAssignment(null);
        }

        // Fetch submissions
        const submissionsQuery = query(
          collection(db, "submissions"),
          where("assignmentId", "==", assignmentId)
        );
        const submissionsSnapshot = await getDocs(submissionsQuery);

        const submissionsData = submissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Submission[];

        // Sort by submission time (newest first)
        submissionsData.sort((a, b) => b.submittedAt - a.submittedAt);
        setSubmissions(submissionsData);

      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleGradeSubmission = async (submissionId: string) => {
    if (!gradingForm.points || !gradingForm.feedback) return;

    try {
      const points = parseFloat(gradingForm.points);
      const submissionRef = doc(db, "submissions", submissionId);
      
      const percentage = assignment ? Math.round((points / assignment.maxPoints) * 100) : null;

      await updateDoc(submissionRef, {
        "grade.points": points,
        "grade.percent": percentage,
        "grade.feedback": gradingForm.feedback,
        "grade.gradedAt": Date.now(),
        "grade.graderId": "current-user-id" // TODO: Get actual user ID
      });

      // Update local state
      setSubmissions(prev => prev.map(sub =>
        sub.id === submissionId
          ? {
              ...sub,
              grade: {
                ...sub.grade,
                points,
                percent: percentage,
                feedback: gradingForm.feedback,
                gradedAt: Date.now(),
                graderId: "current-user-id"
              }
            }
          : sub
      ));

      // Reset form and close grading
      setGradingForm({ points: '', feedback: '' });
      setGradingSubmission(null);
    } catch (error) {
    }
  };

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'txt': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'zip':
      case 'rar': return '📦';
      default: return '📎';
    }
  };

  const getGradeColor = (points: number | null, maxPoints: number) => {
    if (points === null) return 'bg-gray-100 text-gray-700';
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 90) return 'bg-green-100 text-green-700';
    if (percentage >= 80) return 'bg-blue-100 text-blue-700';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-700';
    if (percentage >= 60) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-medical-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-600 text-lg">Loading submissions...</span>
          </div>
        </div>

      </div>
    );
  }

  // Show error if assignment not found
  if (!assignment) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Assignment Not Found</h2>
          <p className="text-slate-600 mb-4">
            The assignment with ID <strong>{assignmentId}</strong> could not be found.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            This could mean the assignment was deleted or the link is incorrect.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
            <Button
              onClick={() => window.location.href = '/courses'}
            >
              View All Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (role !== 'teacher' && role !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">Only teachers and administrators can grade submissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Grade Submissions</h1>
        {assignment ? (
          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {assignment.title}
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Max Points: {assignment.maxPoints}
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Weight: {assignment.weight}%
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Due: {new Date(assignment.dueAt).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <div className="text-slate-500">Loading assignment details...</div>
        )}
        <div className="mt-4">
          <Badge className="bg-blue-100 text-blue-800">
            {submissions.length} Submission{submissions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-6">
        {submissions.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Submissions Yet</h3>
              <p className="text-slate-500">Students haven't submitted any work for this assignment.</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-medical-100 rounded-lg">
                      <User className="w-5 h-5 text-medical-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Student Submission</h3>
                      <p className="text-sm text-slate-600">Student ID: {submission.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </Badge>
                    {submission.grade.gradedAt && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Graded
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* File Information */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileTypeIcon(submission.fileUrl)}</span>
                      <div>
                        <p className="font-medium text-slate-800">Submitted File</p>
                        <p className="text-sm text-slate-600">
                          {submission.fileUrl.includes('http') ? 'File uploaded to storage' : submission.fileUrl}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {submission.fileUrl.includes('http') && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <a href={submission.fileUrl} download>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Grading Section */}
                {submission.grade.gradedAt ? (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Graded</h4>
                        <p className="text-sm text-green-600">
                          Graded on {new Date(submission.grade.gradedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Points</p>
                        <Badge className={getGradeColor(submission.grade.points, assignment?.maxPoints || 100)}>
                          {submission.grade.points} / {assignment?.maxPoints || 'N/A'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Percentage</p>
                        <Badge className={getGradeColor(submission.grade.points, assignment?.maxPoints || 100)}>
                          {submission.grade.percent ?
                            `${submission.grade.percent}%` :
                            (submission.grade.points && assignment?.maxPoints ?
                              `${Math.round((submission.grade.points / assignment.maxPoints) * 100)}%` :
                              'N/A'
                            )
                          }
                        </Badge>
                      </div>
                    </div>
                    
                    {submission.grade.feedback && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-600 mb-1">Feedback</p>
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <p className="text-sm text-slate-800">{submission.grade.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-800">Not Graded Yet</h4>
                        <p className="text-sm text-yellow-600">This submission needs to be graded</p>
                      </div>
                    </div>
                    
                    {gradingSubmission === submission.id ? (
                      <div className="space-y-3">
                        {assignment ? (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Points</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max={assignment?.maxPoints || 100}
                                  value={gradingForm.points}
                                  onChange={(e) => setGradingForm(prev => ({ ...prev, points: e.target.value }))}
                                  placeholder="Enter points"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Max Points</label>
                                <Input
                                  type="number"
                                  value={assignment?.maxPoints || 'N/A'}
                                  disabled
                                  className="bg-slate-100"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Percentage</label>
                                <Input
                                  type="text"
                                  value={gradingForm.points && assignment?.maxPoints ?
                                    `${Math.round((parseFloat(gradingForm.points) / assignment.maxPoints) * 100)}%` :
                                    'Calculating...'
                                  }
                                  disabled
                                  className="bg-slate-100"
                                  placeholder="Auto-calculated"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Assignment Weight</label>
                                <Input
                                  type="text"
                                  value={`${assignment?.weight || 0}%`}
                                  disabled
                                  className="bg-slate-100"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-600 mb-1">Feedback</label>
                              <Input
                                value={gradingForm.feedback}
                                onChange={(e) => setGradingForm(prev => ({ ...prev, feedback: e.target.value }))}
                                placeholder="Provide feedback to the student"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleGradeSubmission(submission.id!)}
                                disabled={!gradingForm.points || !gradingForm.feedback}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Award className="w-4 h-4 mr-1" />
                                Submit Grade
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setGradingSubmission(null);
                                  setGradingForm({ points: '', feedback: '' });
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4 text-slate-500">
                            Loading assignment details for grading...
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setGradingSubmission(submission.id!)}
                        className="bg-medical-600 hover:bg-medical-700"
                      >
                        <Award className="w-4 h-4 mr-1" />
                        Grade Submission
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


