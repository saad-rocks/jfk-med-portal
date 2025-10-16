import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { listAssignments } from "../lib/assignments";
// import CreateAssignment from "../components/CreateAssignment";
import type { Assignment } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs } from "../components/ui/tabs";
// import { MedicalModal } from "../components/ui/medical-modal";
import { 
  Plus, 
  FileText, 
  Calendar, 
  Users, 
  BookOpen, 
  X, 
  Eye, 
  Download,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  FileSpreadsheet,
  MessageSquare,
  Award
} from "lucide-react";

type AssignmentCategory = 'all' | 'quiz' | 'presentation' | 'homework' | 'midterm' | 'final' | 'hw';
type AssignmentStatus = 'all' | 'not-submitted' | 'submitted' | 'graded';
type SortField = 'dueDate' | 'name' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface AssignmentWithStats extends Assignment {
  submissionCount: number;
  gradedCount: number;
  averageScore?: number;
}

export default function AssignmentsTeacher() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { role } = useRole();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  // const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Filters and sorting
  const [selectedCategory, setSelectedCategory] = useState<AssignmentCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Bulk actions
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);



  const fetchAssignments = async () => {
    if (!courseId) return;

    try {
      const assignmentsData = await listAssignments(courseId);
      setAssignments(assignmentsData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  // Filter and sort assignments
  const filteredAndSortedAssignments = useMemo(() => {
    let filtered = assignments.filter(assignment => {
      // Category filter
      if (selectedCategory !== 'all' && assignment.type !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Sort assignments
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'dueDate':
          aValue = a.dueAt;
          bValue = b.dueAt;
          break;
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          aValue = a.dueAt;
          bValue = b.dueAt;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [assignments, selectedCategory, searchQuery, sortField, sortOrder]);

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'Quiz';
      case 'hw': return 'Homework';
      case 'midterm': return 'Midterm';
      case 'final': return 'Final';

      default: return type;
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-green-100 text-green-700 border-green-200';
      case 'hw': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'midterm': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'final': return 'bg-red-100 text-red-700 border-red-200';

      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    // This would need to be implemented with actual submission data
    // For now, returning a mock status
    const now = Date.now();
    const isOverdue = assignment.dueAt < now;
    
    if (isOverdue) {
      return { status: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-700' };
    }
    
    const daysUntilDue = Math.ceil((assignment.dueAt - now) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 3) {
      return { status: 'due-soon', label: `Due in ${daysUntilDue} days`, color: 'bg-yellow-100 text-yellow-700' };
    }
    
    return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-700' };
  };

  const handleBulkDownload = () => {
    // Implement bulk download functionality
  };

  const handleBulkExport = () => {
    // Implement CSV export functionality
  };

  const handleQuickGrade = () => {
    // Implement quick grading functionality
  };





  const toggleAssignmentSelection = (assignmentId: string) => {
    const newSelected = new Set(selectedAssignments);
    if (newSelected.has(assignmentId)) {
      newSelected.delete(assignmentId);
    } else {
      newSelected.add(assignmentId);
    }
    setSelectedAssignments(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAllAssignments = () => {
    if (selectedAssignments.size === filteredAndSortedAssignments.length) {
      setSelectedAssignments(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedAssignments(new Set(filteredAndSortedAssignments.map(a => a.id!)));
      setShowBulkActions(true);
    }
  };

  const renderAssignmentsList = (assignmentsToRender: Assignment[]) => (
    <div className="space-y-4">
      {assignmentsToRender.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assignments found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Start by creating your first assignment for this course.'}
            </p>
            {!searchQuery && selectedStatus === 'all' && selectedCategory === 'all' && (
              <Button
                onClick={() => {
                  // Scroll to top when opening modal
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate("/assignments/new");
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Create First Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignmentsToRender.map((assignment) => {
            const status = getAssignmentStatus(assignment);
            const isSelected = selectedAssignments.has(assignment.id!);
            
            return (
              <Card 
                key={assignment.id} 
                className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
                  isSelected ? 'ring-2 ring-medical-500 bg-medical-50' : ''
                }`}
                onClick={() => toggleAssignmentSelection(assignment.id!)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleAssignmentSelection(assignment.id!);
                          }}
                          className="w-4 h-4 text-medical-600 border-gray-300 rounded focus:ring-medical-500"
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {assignment.title}
                        </h3>
                        <Badge className={getAssignmentTypeColor(assignment.type)}>
                          {getAssignmentTypeLabel(assignment.type)}
                        </Badge>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{assignment.instructions}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Due: {new Date(assignment.dueAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={14} />
                          <span>{assignment.maxPoints} points</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>Weight: {assignment.weight}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 size={14} />
                          <span>0 submissions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href={`/assignments/${assignment.id}/grade`}>
                          <Eye size={14} />
                          View Submissions
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare size={14} />
                        Comments
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

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

  if (role !== 'teacher' && role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-700">Only teachers and administrators can access this page.</p>
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
            Manage and grade assignments for this course
          </p>
        </div>
        <Button
          className="flex items-center gap-2 bg-medical-600 hover:bg-medical-700"
          onClick={() => {
            // Scroll to top when opening modal
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate("/assignments/new");
          }}
        >
          <Plus size={16} />
          Create Assignment
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">


          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AssignmentStatus)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-500"
            >
              <option value="all">All Status</option>
              <option value="not-submitted">Not Submitted</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>

            {/* Sort Field */}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="name">Sort by Name</option>
              <option value="createdAt">Sort by Created</option>
            </select>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2"
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {showBulkActions && (
        <Card className="border-medical-200 bg-medical-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-medical-800">
                  {selectedAssignments.size} assignment(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllAssignments}
                  className="text-medical-600 border-medical-300"
                >
                  {selectedAssignments.size === filteredAndSortedAssignments.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDownload}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickGrade}
                  className="flex items-center gap-2"
                >
                  <Award size={16} />
                  Quick Grade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet size={16} />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs tabs={[
        { key: 'all', label: 'All', content: renderAssignmentsList(filteredAndSortedAssignments) },
        { key: 'quiz', label: 'Quiz', content: renderAssignmentsList(filteredAndSortedAssignments.filter(a => a.type === 'quiz')) },
        { key: 'hw', label: 'Homework', content: renderAssignmentsList(filteredAndSortedAssignments.filter(a => a.type === 'hw')) },
        { key: 'midterm', label: 'Midterm', content: renderAssignmentsList(filteredAndSortedAssignments.filter(a => a.type === 'midterm')) },
        { key: 'final', label: 'Final', content: renderAssignmentsList(filteredAndSortedAssignments.filter(a => a.type === 'final')) },

      ]} />

      {/* Create Assignment Modal */}
      
    </div>
  );
}







