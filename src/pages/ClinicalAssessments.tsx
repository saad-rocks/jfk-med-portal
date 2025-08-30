import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs } from "../components/ui/tabs";
import {
  Stethoscope,
  User as UserIcon,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Heart,
  Brain,
  Eye,
  Activity,
  FileText,
  MessageSquare,
  Award,
  TrendingUp,
  Users,
  Target
} from "lucide-react";
import type { User, Course } from "../types";

interface ClinicalAssessment {
  id?: string;
  studentId: string;
  courseId: string;
  assessorId: string;
  assessmentDate: number;
  assessmentType: 'clinical_rotation' | 'patient_interaction' | 'procedural_skills' | 'professionalism';
  patientCase?: string;
  location?: string;
  duration?: number;
  
  // Clinical Skills (1-5 scale)
  historyTaking: number;
  physicalExamination: number;
  clinicalReasoning: number;
  differentialDiagnosis: number;
  treatmentPlanning: number;
  
  // Communication Skills (1-5 scale)
  patientCommunication: number;
  professionalCommunication: number;
  documentation: number;
  
  // Professionalism (1-5 scale)
  punctuality: number;
  appearance: number;
  teamwork: number;
  ethicalBehavior: number;
  
  // Overall Assessment
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  
  // Feedback
  assessorComments: string;
  studentReflection?: string;
  
  createdAt: number;
  updatedAt: number;
}

interface ClinicalAssessmentForm {
  assessmentType: ClinicalAssessment['assessmentType'];
  patientCase: string;
  location: string;
  duration: number;
  historyTaking: number;
  physicalExamination: number;
  clinicalReasoning: number;
  differentialDiagnosis: number;
  treatmentPlanning: number;
  patientCommunication: number;
  professionalCommunication: number;
  documentation: number;
  punctuality: number;
  appearance: number;
  teamwork: number;
  ethicalBehavior: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  assessorComments: string;
}

const assessmentTypes = [

  { key: 'clinical_rotation', label: 'Clinical Rotation', icon: <UserIcon className="w-4 h-4" /> },
  { key: 'patient_interaction', label: 'Patient Interaction', icon: <Heart className="w-4 h-4" /> },
  { key: 'procedural_skills', label: 'Procedural Skills', icon: <Activity className="w-4 h-4" /> },
  { key: 'professionalism', label: 'Professionalism', icon: <Award className="w-4 h-4" /> }
];

const ratingLabels = {
  1: 'Unsatisfactory',
  2: 'Below Expectations',
  3: 'Meets Expectations',
  4: 'Exceeds Expectations',
  5: 'Outstanding'
};

export default function ClinicalAssessments() {
  const { courseId } = useParams<{ courseId: string }>();
  const { role } = useRole();
  const [assessments, setAssessments] = useState<ClinicalAssessment[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState<ClinicalAssessmentForm>({
    assessmentType: 'clinical_rotation',
    patientCase: '',
    location: '',
    duration: 60,
    historyTaking: 3,
    physicalExamination: 3,
    clinicalReasoning: 3,
    differentialDiagnosis: 3,
    treatmentPlanning: 3,
    patientCommunication: 3,
    professionalCommunication: 3,
    documentation: 3,
    punctuality: 3,
    appearance: 3,
    teamwork: 3,
    ethicalBehavior: 3,
    strengths: [],
    areasForImprovement: [],
    recommendations: [],
    assessorComments: ''
  });

  useEffect(() => {
    if (courseId) {
      fetchClinicalData();
    }
  }, [courseId]);

  const fetchClinicalData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseQuery = query(collection(db, 'courses'), where('id', '==', courseId));
      const courseSnapshot = await getDocs(courseQuery);
      if (!courseSnapshot.empty) {
        setCourse(courseSnapshot.docs[0].data() as Course);
      }

      // Fetch enrollments and students
      const enrollmentsQuery = query(collection(db, 'enrollments'), where('courseId', '==', courseId));
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      
      const studentIds = enrollmentsSnapshot.docs.map(doc => doc.data().studentId);
      
      // Fetch student details
      const studentsQuery = query(collection(db, 'users'), where('uid', 'in', studentIds));
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsData = studentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
      setStudents(studentsData);

      // Fetch clinical assessments
      const assessmentsQuery = query(collection(db, 'clinicalAssessments'), where('courseId', '==', courseId));
      const assessmentsSnapshot = await getDocs(assessmentsQuery);
      const assessmentsData = assessmentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ClinicalAssessment));
      setAssessments(assessmentsData);
    } catch (error) {
      console.error('Error fetching clinical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = (form: ClinicalAssessmentForm): number => {
    const clinicalSkills = (form.historyTaking + form.physicalExamination + form.clinicalReasoning + 
                           form.differentialDiagnosis + form.treatmentPlanning) / 5;
    
    const communicationSkills = (form.patientCommunication + form.professionalCommunication + 
                                form.documentation) / 3;
    
    const professionalism = (form.punctuality + form.appearance + form.teamwork + 
                           form.ethicalBehavior) / 4;
    
    return Math.round((clinicalSkills + communicationSkills + professionalism) / 3);
  };

  const handleAssessmentSubmit = async () => {
    if (!selectedStudent || !courseId) return;

    try {
      const overallScore = calculateOverallScore(assessmentForm);
      
      const newAssessment: Omit<ClinicalAssessment, 'id'> = {
        studentId: selectedStudent,
        courseId,
        assessorId: 'current-user-id', // TODO: Get from auth
        assessmentDate: Date.now(),
        overallScore,
        ...assessmentForm,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await addDoc(collection(db, 'clinicalAssessments'), newAssessment);
      
      // Reset form and refresh data
      setShowAssessmentForm(false);
      setSelectedStudent(null);
      setAssessmentForm({
        assessmentType: 'clinical_rotation',
        patientCase: '',
        location: '',
        duration: 60,
        historyTaking: 3,
        physicalExamination: 3,
        clinicalReasoning: 3,
        differentialDiagnosis: 3,
        treatmentPlanning: 3,
        patientCommunication: 3,
        professionalCommunication: 3,
        documentation: 3,
        punctuality: 3,
        appearance: 3,
        teamwork: 3,
        ethicalBehavior: 3,
        strengths: [],
        areasForImprovement: [],
        recommendations: [],
        assessorComments: ''
      });
      
      fetchClinicalData();
    } catch (error) {
      console.error('Error creating assessment:', error);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 4.5) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 3.5) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 2.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getAssessmentTypeIcon = (type: string) => {
    return assessmentTypes.find(t => t.key === type)?.icon || <FileText className="w-4 h-4" />;
  };

  if (role !== 'teacher' && role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-700">Only teachers and administrators can access clinical assessments.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading clinical assessments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Assessments</h1>
          <p className="text-gray-600 mt-2">
            {course?.title} - {course?.code} • {course?.semester}
          </p>
        </div>
        <Button onClick={() => setShowAssessmentForm(true)}>
          <Stethoscope className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Assessment Form Modal */}
      {showAssessmentForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>New Clinical Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
              <select
                value={selectedStudent || ''}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.uid} value={student.uid}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>

            {/* Assessment Type and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
                <select
                  value={assessmentForm.assessmentType}
                  onChange={(e) => setAssessmentForm({...assessmentForm, assessmentType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {assessmentTypes.map((type) => (
                    <option key={type.key} value={type.key}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Case</label>
                <Input
                  value={assessmentForm.patientCase}
                  onChange={(e) => setAssessmentForm({...assessmentForm, patientCase: e.target.value})}
                  placeholder="e.g., Chest pain, SOB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <Input
                  type="number"
                  value={assessmentForm.duration}
                  onChange={(e) => setAssessmentForm({...assessmentForm, duration: parseInt(e.target.value)})}
                  min="15"
                  max="180"
                />
              </div>
            </div>

            {/* Clinical Skills Assessment */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Clinical Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { key: 'historyTaking', label: 'History Taking' },
                  { key: 'physicalExamination', label: 'Physical Exam' },
                  { key: 'clinicalReasoning', label: 'Clinical Reasoning' },
                  { key: 'differentialDiagnosis', label: 'Differential Dx' },
                  { key: 'treatmentPlanning', label: 'Treatment Plan' }
                ].map((skill) => (
                  <div key={skill.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{skill.label}</label>
                    <select
                      value={assessmentForm[skill.key as keyof ClinicalAssessmentForm] as number}
                      onChange={(e) => setAssessmentForm({...assessmentForm, [skill.key]: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} - {ratingLabels[rating as keyof typeof ratingLabels]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Skills Assessment */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'patientCommunication', label: 'Patient Communication' },
                  { key: 'professionalCommunication', label: 'Professional Communication' },
                  { key: 'documentation', label: 'Documentation' }
                ].map((skill) => (
                  <div key={skill.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{skill.label}</label>
                    <select
                      value={assessmentForm[skill.key as keyof ClinicalAssessmentForm] as number}
                      onChange={(e) => setAssessmentForm({...assessmentForm, [skill.key]: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} - {ratingLabels[rating as keyof typeof ratingLabels]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Professionalism Assessment */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professionalism</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'punctuality', label: 'Punctuality' },
                  { key: 'appearance', label: 'Appearance' },
                  { key: 'teamwork', label: 'Teamwork' },
                  { key: 'ethicalBehavior', label: 'Ethical Behavior' }
                ].map((skill) => (
                  <div key={skill.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{skill.label}</label>
                    <select
                      value={assessmentForm[skill.key as keyof ClinicalAssessmentForm] as number}
                      onChange={(e) => setAssessmentForm({...assessmentForm, [skill.key]: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} - {ratingLabels[rating as keyof typeof ratingLabels]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments and Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assessor Comments</label>
              <textarea
                value={assessmentForm.assessorComments}
                onChange={(e) => setAssessmentForm({...assessmentForm, assessorComments: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide detailed feedback on the student's performance..."
              />
            </div>

            {/* Overall Score Preview */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Calculated Overall Score:</span>
                <Badge className={`text-lg px-3 py-1 ${getScoreColor(calculateOverallScore(assessmentForm))}`}>
                  {calculateOverallScore(assessmentForm).toFixed(1)} - {ratingLabels[Math.round(calculateOverallScore(assessmentForm)) as keyof typeof ratingLabels]}
                </Badge>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <Button onClick={handleAssessmentSubmit} disabled={!selectedStudent}>
                Submit Assessment
              </Button>
              <Button variant="outline" onClick={() => setShowAssessmentForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Assessments Tabs */}
      <Tabs tabs={[
        {
          key: 'overview',
          label: 'Overview',
          content: (
            <div className="space-y-4">
              {students.map((student) => {
                const studentAssessments = assessments.filter(a => a.studentId === student.uid);
                const averageScore = studentAssessments.length > 0 
                  ? studentAssessments.reduce((sum, a) => sum + a.overallScore, 0) / studentAssessments.length
                  : 0;
                
                return (
                  <Card key={student.uid} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-purple-600">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">ID: {student.studentId} • {student.mdYear}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-lg px-3 py-1 ${getScoreColor(averageScore)}`}>
                            {averageScore.toFixed(1)}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {studentAssessments.length} assessment{studentAssessments.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {studentAssessments.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {studentAssessments.filter(a => a.overallScore >= 4).length}
                            </div>
                            <div className="text-sm text-gray-600">Exceeds Expectations</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {studentAssessments.filter(a => a.overallScore >= 3 && a.overallScore < 4).length}
                            </div>
                            <div className="text-sm text-gray-600">Meets Expectations</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                              {studentAssessments.filter(a => a.overallScore < 3).length}
                            </div>
                            <div className="text-sm text-gray-600">Below Expectations</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Last assessment: {studentAssessments.length > 0 
                            ? new Date(Math.max(...studentAssessments.map(a => a.assessmentDate))).toLocaleDateString()
                            : 'None'
                          }
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student.uid);
                            setShowAssessmentForm(true);
                          }}
                        >
                          Assess Student
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        },
        {
          key: 'assessments',
          label: 'All Assessments',
          content: (
            <div className="space-y-4">
              {assessments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Clinical Assessments Yet</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first clinical assessment for a student.</p>
                    <Button onClick={() => setShowAssessmentForm(true)}>
                      Create Assessment
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                assessments.map((assessment) => {
                  const student = students.find(s => s.uid === assessment.studentId);
                  return (
                    <Card key={assessment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {getAssessmentTypeIcon(assessment.assessmentType)}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {assessmentTypes.find(t => t.key === assessment.assessmentType)?.label}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {student?.name} • {new Date(assessment.assessmentDate).toLocaleDateString()}
                              </p>
                              {assessment.patientCase && (
                                <p className="text-sm text-gray-600">Case: {assessment.patientCase}</p>
                              )}
                            </div>
                          </div>
                          <Badge className={`text-lg px-3 py-1 ${getScoreColor(assessment.overallScore)}`}>
                            {assessment.overallScore.toFixed(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Clinical Skills</h4>
                            <div className="space-y-1 text-sm">
                              <div>History: {assessment.historyTaking}/5</div>
                              <div>Physical: {assessment.physicalExamination}/5</div>
                              <div>Reasoning: {assessment.clinicalReasoning}/5</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Communication</h4>
                            <div className="space-y-1 text-sm">
                              <div>Patient: {assessment.patientCommunication}/5</div>
                              <div>Professional: {assessment.professionalCommunication}/5</div>
                              <div>Documentation: {assessment.documentation}/5</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Professionalism</h4>
                            <div className="space-y-1 text-sm">
                              <div>Punctuality: {assessment.punctuality}/5</div>
                              <div>Appearance: {assessment.appearance}/5</div>
                              <div>Teamwork: {assessment.teamwork}/5</div>
                            </div>
                          </div>
                        </div>

                        {assessment.assessorComments && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Assessor Comments</h4>
                            <p className="text-gray-700">{assessment.assessorComments}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )
        }
      ]} />
    </div>
  );
}
