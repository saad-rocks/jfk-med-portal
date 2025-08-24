import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useRole';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { getAllSessions, createSession, updateSession, deleteSession, setSessionAsCurrent, getSessionDisplayName, getSessionStatus, getSessionProgress, initializeDefaultSessions } from '../lib/sessions';
import { Calendar, Clock, Plus, Edit2, Trash2, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
export default function Sessions() {
    const { role } = useRole();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load sessions');
            console.error('Error loading sessions:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddSession = () => {
        setEditingSession(null);
        setShowAddModal(true);
    };
    const handleEditSession = (session) => {
        setEditingSession(session);
        setShowAddModal(true);
    };
    const handleDeleteSession = async (sessionId) => {
        if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteSession(sessionId);
            await loadSessions();
            alert('Session deleted successfully');
        }
        catch (err) {
            console.error('Error deleting session:', err);
            alert('Failed to delete session: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };
    const handleSetAsCurrent = async (sessionId) => {
        if (!confirm('Set this session as the current active session? This will deactivate all other sessions.')) {
            return;
        }
        try {
            await setSessionAsCurrent(sessionId);
            await loadSessions();
            alert('Session set as current successfully');
        }
        catch (err) {
            console.error('Error setting session as current:', err);
            alert('Failed to set session as current: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };
    const handleSaveSession = async (sessionData) => {
        try {
            if (editingSession) {
                await updateSession(editingSession.id, sessionData);
                alert('Session updated successfully');
            }
            else {
                await createSession(sessionData);
                alert('Session created successfully');
            }
            setShowAddModal(false);
            await loadSessions();
        }
        catch (err) {
            console.error('Error saving session:', err);
            alert('Failed to save session: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };
    // Access control
    if (role !== 'admin') {
        return (_jsx("div", { className: "p-6", children: _jsxs(Card, { className: "p-8 text-center", children: [_jsx(Shield, { className: "h-16 w-16 text-red-500 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Access Denied" }), _jsx("p", { className: "text-gray-600", children: "You don't have permission to access session management." })] }) }));
    }
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-gray-600", children: "Loading sessions..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsxs(Card, { className: "p-8 text-center", children: [_jsx(AlertTriangle, { className: "h-16 w-16 text-red-500 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Error Loading Sessions" }), _jsx("p", { className: "text-gray-600 mb-4", children: error }), _jsx(Button, { onClick: loadSessions, children: "Try Again" })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Session Management", breadcrumb: [{ label: 'Sessions' }] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Academic Sessions" }), _jsx("p", { className: "text-gray-600", children: "Manage Spring, Summer, and Fall sessions" })] }), _jsxs(Button, { onClick: handleAddSession, className: "flex items-center gap-2", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add Session"] })] }), _jsx("div", { className: "space-y-8", children: (() => {
                    // Group sessions by year
                    const sessionsByYear = sessions.reduce((acc, session) => {
                        const year = session.year;
                        if (!acc[year]) {
                            acc[year] = [];
                        }
                        acc[year].push(session);
                        return acc;
                    }, {});
                    // Sort years and sessions within each year
                    const sortedYears = Object.keys(sessionsByYear)
                        .map(Number)
                        .sort((a, b) => a - b);
                    return sortedYears.map(year => {
                        const yearSessions = sessionsByYear[year].sort((a, b) => {
                            // Sort by session order: Spring (1), Summer (2), Fall (3)
                            const sessionOrder = { 'Spring': 1, 'Summer': 2, 'Fall': 3 };
                            return (sessionOrder[a.name] || 0) -
                                (sessionOrder[b.name] || 0);
                        });
                        return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "border-b border-gray-200 pb-2", children: _jsxs("h2", { className: "text-xl font-bold text-gray-900", children: ["Academic Year ", year] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: yearSessions.map((session) => {
                                        const status = getSessionStatus(session);
                                        const progress = getSessionProgress(session);
                                        return (_jsxs(Card, { className: "hover:shadow-lg transition-shadow", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-lg", children: getSessionDisplayName(session) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => handleEditSession(session), children: _jsx(Edit2, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => session.id && handleDeleteSession(session.id), className: "text-red-600 hover:text-red-700", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [!session.isCurrent && (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => session.id && handleSetAsCurrent(session.id), className: "text-blue-600 border-blue-200 hover:bg-blue-50", children: [_jsx(Shield, { className: "h-4 w-4 mr-1" }), "Set as Current"] })), session.isCurrent && (_jsxs(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200", children: [_jsx(Shield, { className: "h-3 w-3 mr-1" }), "Current Session"] }))] })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Badge, { variant: status === 'current' ? 'success' :
                                                                        status === 'upcoming' ? 'secondary' : 'error', children: status === 'current' ? 'Active' :
                                                                        status === 'upcoming' ? 'Upcoming' : 'Past' }), session.isCurrent && (_jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200", children: "Current" }))] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Start Date:" }), _jsx("span", { className: "font-medium", children: session.startDate instanceof Date
                                                                                ? session.startDate.toLocaleDateString()
                                                                                : session.startDate.toDate().toLocaleDateString() })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "End Date:" }), _jsx("span", { className: "font-medium", children: session.endDate instanceof Date
                                                                                ? session.endDate.toLocaleDateString()
                                                                                : session.endDate.toDate().toLocaleDateString() })] })] }), session.description && (_jsx("p", { className: "text-sm text-gray-600", children: session.description })), status === 'current' && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Progress" }), _jsxs("span", { className: "font-medium", children: [progress, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) })] })), (session.registrationDeadline || session.withdrawalDeadline) && (_jsxs("div", { className: "space-y-2 pt-2 border-t", children: [session.registrationDeadline && (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-gray-500", children: "Registration Deadline:" }), _jsx("span", { className: "font-medium", children: session.registrationDeadline instanceof Date
                                                                                ? session.registrationDeadline.toLocaleDateString()
                                                                                : session.registrationDeadline.toDate().toLocaleDateString() })] })), session.withdrawalDeadline && (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-gray-500", children: "Withdrawal Deadline:" }), _jsx("span", { className: "font-medium", children: session.withdrawalDeadline instanceof Date
                                                                                ? session.withdrawalDeadline.toLocaleDateString()
                                                                                : session.withdrawalDeadline.toDate().toLocaleDateString() })] }))] }))] })] }, session.id));
                                    }) })] }, year));
                    });
                })() }), sessions.length === 0 && (_jsxs(Card, { className: "p-8 text-center", children: [_jsx(Calendar, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No sessions found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Create your first academic session to get started." }), _jsx(Button, { onClick: handleAddSession, children: "Create Session" })] })), showAddModal && (_jsx(SessionModal, { session: editingSession, onClose: () => setShowAddModal(false), onSave: handleSaveSession }))] }));
}
function SessionModal({ session, onClose, onSave }) {
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
    const handleSubmit = (e) => {
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
        const sessionData = {
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
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b", children: _jsxs("h2", { className: "text-xl font-bold text-gray-900", children: [session ? 'Edit' : 'Add', " Session"] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Session Name" }), _jsxs("select", { value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "Spring", children: "Spring" }), _jsx("option", { value: "Summer", children: "Summer" }), _jsx("option", { value: "Fall", children: "Fall" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Year" }), _jsx(Input, { type: "number", value: formData.year, onChange: (e) => handleInputChange('year', parseInt(e.target.value)), min: new Date().getFullYear() - 5, max: new Date().getFullYear() + 5, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), _jsx(Input, { type: "date", value: formData.startDate, onChange: (e) => handleInputChange('startDate', e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), _jsx(Input, { type: "date", value: formData.endDate, onChange: (e) => handleInputChange('endDate', e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx(Input, { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: "Optional session description" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Registration Deadline" }), _jsx(Input, { type: "date", value: formData.registrationDeadline, onChange: (e) => handleInputChange('registrationDeadline', e.target.value), placeholder: "Optional" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Withdrawal Deadline" }), _jsx(Input, { type: "date", value: formData.withdrawalDeadline, onChange: (e) => handleInputChange('withdrawalDeadline', e.target.value), placeholder: "Optional" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "isCurrent", checked: formData.isCurrent, onChange: (e) => handleInputChange('isCurrent', e.target.checked), className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "isCurrent", className: "text-sm font-medium text-gray-700", children: "Set as Current Session" })] }), formData.isCurrent && (_jsxs("p", { className: "text-xs text-blue-600 bg-blue-50 p-2 rounded", children: [_jsx(Shield, { className: "inline h-3 w-3 mr-1" }), "This will set this session as the current active session. Only one session can be current at a time."] })), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, className: "flex-1", children: "Cancel" }), _jsxs(Button, { type: "submit", className: "flex-1", children: [session ? 'Update' : 'Create', " Session"] })] })] })] }) }));
}
