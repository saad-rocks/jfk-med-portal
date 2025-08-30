import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useRole';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
  setSessionAsCurrent,
  getSessionDisplayName,
  getSessionStatus,
  getSessionProgress,
  initializeDefaultSessions,
  type Session,
  type CreateSessionInput
} from '../lib/sessions';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function Sessions() {
  const { role } = useRole();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize default sessions if none exist
      await initializeDefaultSessions();
      
      const fetchedSessions = await getAllSessions();
      setSessions(fetchedSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = () => {
    setEditingSession(null);
    setShowAddModal(true);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setShowAddModal(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteSession(sessionId);
      await loadSessions();
      alert('Session deleted successfully');
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Failed to delete session: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleSetAsCurrent = async (sessionId: string) => {
    if (!confirm('Set this session as the current active session? This will deactivate all other sessions.')) {
      return;
    }

    try {
      await setSessionAsCurrent(sessionId);
      await loadSessions();
      alert('Session set as current successfully');
    } catch (err) {
      console.error('Error setting session as current:', err);
      alert('Failed to set session as current: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleSaveSession = async (sessionData: CreateSessionInput) => {
    try {
      if (editingSession) {
        await updateSession(editingSession.id!, sessionData);
        alert('Session updated successfully');
      } else {
        await createSession(sessionData);
        alert('Session created successfully');
      }
      
      setShowAddModal(false);
      await loadSessions();
    } catch (err) {
      console.error('Error saving session:', err);
      alert('Failed to save session: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Access control
  if (role !== 'admin') {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <ShieldCheck className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access session management.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading sessions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Sessions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadSessions}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Session Management"
        breadcrumb={[{ label: 'Sessions' }]}
      />

      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Sessions</h1>
          <p className="text-gray-600">Manage Spring, Summer, and Fall sessions</p>
        </div>
        <Button onClick={handleAddSession} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Session
        </Button>
      </div>

      {/* Sessions Grid - Grouped by Academic Year */}
      <div className="space-y-8">
        {(() => {
          // Group sessions by year
          const sessionsByYear = sessions.reduce((acc, session) => {
            const year = session.year;
            if (!acc[year]) {
              acc[year] = [];
            }
            acc[year].push(session);
            return acc;
          }, {} as Record<number, Session[]>);

          // Sort years and sessions within each year
          const sortedYears = Object.keys(sessionsByYear)
            .map(Number)
            .sort((a, b) => a - b);

          return sortedYears.map(year => {
            const yearSessions = sessionsByYear[year].sort((a, b) => {
              // Sort by session order: Spring (1), Summer (2), Fall (3)
              const sessionOrder = { 'Spring': 1, 'Summer': 2, 'Fall': 3 };
              return (sessionOrder[a.name as keyof typeof sessionOrder] || 0) - 
                     (sessionOrder[b.name as keyof typeof sessionOrder] || 0);
            });

            return (
              <div key={year} className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-xl font-bold text-gray-900">Academic Year {year}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {yearSessions.map((session) => {
                    const status = getSessionStatus(session);
                    const progress = getSessionProgress(session);
                    
                    return (
                      <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{getSessionDisplayName(session)}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSession(session)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => session.id && handleDeleteSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {!session.isCurrent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => session.id && handleSetAsCurrent(session.id)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Set as Current
                    </Button>
                  )}
                  {session.isCurrent && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Current Session
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={
                      status === 'current' ? 'success' : 
                      status === 'upcoming' ? 'secondary' : 'error'
                    }
                  >
                    {status === 'current' ? 'Active' : 
                     status === 'upcoming' ? 'Upcoming' : 'Past'}
                  </Badge>
                  {session.isCurrent && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Current
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">
                      {session.startDate instanceof Date 
                        ? session.startDate.toLocaleDateString()
                        : session.startDate.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">
                      {session.endDate instanceof Date 
                        ? session.endDate.toLocaleDateString()
                        : session.endDate.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {session.description && (
                  <p className="text-sm text-gray-600">{session.description}</p>
                )}

                {/* Progress Bar for Current Session */}
                {status === 'current' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Registration/Withdrawal Deadlines */}
                {(session.registrationDeadline || session.withdrawalDeadline) && (
                  <div className="space-y-2 pt-2 border-t">
                    {session.registrationDeadline && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Registration Deadline:</span>
                        <span className="font-medium">
                          {session.registrationDeadline instanceof Date 
                            ? session.registrationDeadline.toLocaleDateString()
                            : session.registrationDeadline.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {session.withdrawalDeadline && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Withdrawal Deadline:</span>
                        <span className="font-medium">
                          {session.withdrawalDeadline instanceof Date 
                            ? session.withdrawalDeadline.toLocaleDateString()
                            : session.withdrawalDeadline.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {sessions.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-4">Create your first academic session to get started.</p>
          <Button onClick={handleAddSession}>Create Session</Button>
        </Card>
      )}

      {/* Add/Edit Session Modal */}
      {showAddModal && (
        <SessionModal
          session={editingSession}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveSession}
        />
      )}
    </div>
  );
}

// Session Modal Component
interface SessionModalProps {
  session: Session | null;
  onClose: () => void;
  onSave: (sessionData: CreateSessionInput) => void;
}

function SessionModal({ session, onClose, onSave }: SessionModalProps) {
  const [formData, setFormData] = useState({
    name: session?.name || 'Spring',
    year: session?.year || new Date().getFullYear(),
    startDate: session?.startDate 
      ? (session.startDate instanceof Date 
          ? session.startDate.toISOString().split('T')[0]
          : session.startDate.toDate().toISOString().split('T')[0])
      : '',
    endDate: session?.endDate 
      ? (session.endDate instanceof Date 
          ? session.endDate.toISOString().split('T')[0]
          : session.endDate.toDate().toISOString().split('T')[0])
      : '',
    description: session?.description || '',
    registrationDeadline: session?.registrationDeadline 
      ? (session.registrationDeadline instanceof Date 
          ? session.registrationDeadline.toISOString().split('T')[0]
          : session.registrationDeadline.toDate().toISOString().split('T')[0])
      : '',
    withdrawalDeadline: session?.withdrawalDeadline 
      ? (session.withdrawalDeadline instanceof Date 
          ? session.withdrawalDeadline.toISOString().split('T')[0]
          : session.withdrawalDeadline.toDate().toISOString().split('T')[0])
      : '',
    isCurrent: session?.isCurrent || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.year || !formData.startDate || !formData.endDate) {
      alert('Name, year, start date, and end date are required');
      return;
    }
    
    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate >= endDate) {
      alert('Start date must be before end date');
      return;
    }
    
    const sessionData: CreateSessionInput = {
      name: formData.name,
      year: parseInt(formData.year.toString()),
      startDate,
      endDate,
      description: formData.description || undefined,
      registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline) : undefined,
      withdrawalDeadline: formData.withdrawalDeadline ? new Date(formData.withdrawalDeadline) : undefined,
      isCurrent: formData.isCurrent,
    };
    
    onSave(sessionData);
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {session ? 'Edit' : 'Add'} Session
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
            <select
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <Input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              min={new Date().getFullYear() - 5}
              max={new Date().getFullYear() + 5}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional session description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
            <Input
              type="date"
              value={formData.registrationDeadline}
              onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Deadline</label>
            <Input
              type="date"
              value={formData.withdrawalDeadline}
              onChange={(e) => handleInputChange('withdrawalDeadline', e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isCurrent"
              checked={formData.isCurrent}
              onChange={(e) => handleInputChange('isCurrent', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">
              Set as Current Session
            </label>
          </div>
          {formData.isCurrent && (
            <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <ShieldCheck className="inline h-3 w-3 mr-1" />
              This will set this session as the current active session. Only one session can be current at a time.
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {session ? 'Update' : 'Create'} Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
