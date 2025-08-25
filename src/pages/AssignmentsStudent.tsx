import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { listAssignments } from "../lib/assignments";
import AssignmentSubmission from "../components/AssignmentSubmission";
import type { Assignment } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FileText, Calendar, Users, BookOpen, Eye } from "lucide-react";

export default function AssignmentsStudent() {
  const { courseId } = useParams<{ courseId: string }>();
  const { role } = useRole();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const fetchAssignments = async () => {
    if (!courseId) return;

    try {
      const assignmentsData = await listAssignments(courseId);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'hw': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'midterm': return 'bg-orange-100 text-orange-800';
      case 'final': return 'bg-red-100 text-red-800';
      case 'osce': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case 'hw': return 'Homework';
      case 'quiz': return 'Quiz';
      case 'midterm': return 'Midterm';
      case 'final': return 'Final';
      case 'osce': return 'OSCE';
      default: return type;
    }
  };

  const isOverdue = (dueDate: number) => {
    return new Date().getTime() > dueDate;
  };

  const isDueSoon = (dueDate: number) => {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return dueDate > now && dueDate - now <= oneDay;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading assignments...</span>
        </div>
      </div>
    );
  }

  // Check if user is a student
  if (role !== 'student') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-700">Only students can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Assignments</h1>
          <p className="text-gray-600 mt-2">
            View and submit your assignments for this course
          </p>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assignments available
              </h3>
              <p className="text-gray-600">
                Your instructor hasn't posted any assignments for this course yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {assignment.title}
                        </h3>
                        <Badge className={getAssignmentTypeColor(assignment.type)}>
                          {getAssignmentTypeLabel(assignment.type)}
                        </Badge>
                        {isOverdue(assignment.dueAt) && (
                          <Badge variant="error">Overdue</Badge>
                        )}
                        {isDueSoon(assignment.dueAt) && !isOverdue(assignment.dueAt) && (
                          <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{assignment.instructions}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span className={isOverdue(assignment.dueAt) ? 'text-red-600 font-medium' : ''}>
                            Due: {new Date(assignment.dueAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={14} />
                          <span>{assignment.maxPoints} points</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>Weight: {assignment.weight}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmissionModal(true);
                        }}
                      >
                        <Eye size={14} />
                        View & Submit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AssignmentSubmission
              assignment={selectedAssignment}
              onSuccess={() => {
                setShowSubmissionModal(false);
                setSelectedAssignment(null);
                fetchAssignments(); // Refresh the assignments list
              }}
              onCancel={() => {
                setShowSubmissionModal(false);
                setSelectedAssignment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}


