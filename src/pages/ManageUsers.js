import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useRole';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { getAllUsers, getUsersByRole, createUser, createUserWithoutSignIn, updateUser, deleteUserProfile, searchUsers, getUserStats } from '../lib/users';
import { seedUsersData } from '../lib/seedUsers';
import { Users, UserPlus, Search, Filter, Edit2, Trash2, ArrowLeft, GraduationCap, BookOpen, Shield, Mail, Phone, Calendar, MapPin, User } from 'lucide-react';
export default function ManageUsers() {
    const { role } = useRole();
    const [viewMode, setViewMode] = useState('categories');
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterYear, setFilterYear] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    // Firebase data state
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        students: 0,
        teachers: 0,
        admins: 0,
        activeUsers: 0
    });
    const [error, setError] = useState(null);
    // Load users data on component mount
    useEffect(() => {
        initializeData();
    }, []);
    const initializeData = async () => {
        try {
            // Seed initial data if needed
            await seedUsersData();
            // Load users and stats
            await loadUsers();
            await loadUserStats();
        }
        catch (error) {
            console.error('Error initializing data:', error);
            setError('Failed to initialize user data');
        }
    };
    // Load users based on selected role or all users
    const loadUsers = async () => {
        try {
            console.log('📊 Loading users...', selectedRole ? `Role: ${selectedRole}` : 'All users');
            setLoading(true);
            setError(null);
            let userData;
            if (selectedRole) {
                userData = await getUsersByRole(selectedRole);
                console.log(`📋 Loaded ${userData.length} ${selectedRole}s:`, userData);
            }
            else {
                userData = await getAllUsers();
                console.log(`📋 Loaded ${userData.length} total users:`, userData);
            }
            setUsers(userData);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
            console.error('❌ Error loading users:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // Load user statistics
    const loadUserStats = async () => {
        try {
            console.log('📈 Loading user statistics...');
            const stats = await getUserStats();
            console.log('📊 User stats loaded:', stats);
            setUserStats(stats);
        }
        catch (err) {
            console.error('❌ Error loading user stats:', err);
        }
    };
    // Reload users when selected role changes
    useEffect(() => {
        if (viewMode === 'users') {
            loadUsers();
        }
    }, [selectedRole, viewMode]);
    // Access control
    if (role !== 'admin') {
        return (_jsx("div", { className: "p-6", children: _jsxs(Card, { className: "p-8 text-center", children: [_jsx(Shield, { className: "h-16 w-16 text-red-500 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Access Denied" }), _jsx("p", { className: "text-gray-600", children: "You don't have permission to access user management." })] }) }));
    }
    const filteredUsers = users.filter(user => {
        if (selectedRole && user.role !== selectedRole)
            return false;
        if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            return false;
        if (filterYear !== 'all' && user.mdYear !== filterYear)
            return false;
        if (filterDepartment !== 'all' && user.department !== filterDepartment)
            return false;
        return true;
    });
    const getUserCount = (role) => {
        switch (role) {
            case 'student': return userStats.students;
            case 'teacher': return userStats.teachers;
            case 'admin': return userStats.admins;
            default: return 0;
        }
    };
    const handleBackToCategories = () => {
        setViewMode('categories');
        setSelectedRole(null);
        setSearchTerm('');
        setFilterYear('all');
        setFilterDepartment('all');
    };
    const handleViewUsers = (role) => {
        setSelectedRole(role);
        setViewMode('users');
    };
    const handleAddUser = () => {
        console.log('➕ Adding new user - setting editingUser to null');
        setEditingUser(null);
        setShowAddModal(true);
        console.log('📝 Modal state:', { editingUser: null, showAddModal: true });
    };
    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowAddModal(true);
    };
    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteUserProfile(userId);
            await loadUsers(); // Reload users after deletion
            await loadUserStats(); // Update statistics
            alert('User deleted successfully');
        }
        catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };
    // Loading state
    if (loading && viewMode === 'categories') {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-gray-600", children: "Loading user data..." })] }) }));
    }
    // Error state
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsxs(Card, { className: "p-8 text-center", children: [_jsx("div", { className: "h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Users, { className: "h-8 w-8 text-red-500" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Error Loading Users" }), _jsx("p", { className: "text-gray-600 mb-4", children: error }), _jsx(Button, { onClick: () => loadUsers(), children: "Try Again" })] }) }));
    }
    if (viewMode === 'categories') {
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "User Management" }), _jsx("p", { className: "text-gray-600", children: "Manage students, teachers, and administrators" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(Card, { className: "p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group", onClick: () => handleViewUsers('student'), children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "h-16 w-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300", children: _jsx(GraduationCap, { className: "h-8 w-8 text-white" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Students" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Medical students enrolled in the program" }), _jsx("div", { className: "flex justify-center mb-4", children: _jsxs(Badge, { variant: "secondary", className: "text-lg px-4 py-2", children: [getUserCount('student'), " Total"] }) }), _jsx(Button, { className: "w-full group-hover:bg-blue-600 transition-colors duration-300", children: "Manage Students" })] }) }), _jsx(Card, { className: "p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group", onClick: () => handleViewUsers('teacher'), children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300", children: _jsx(BookOpen, { className: "h-8 w-8 text-white" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Teachers" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Faculty members and instructors" }), _jsx("div", { className: "flex justify-center mb-4", children: _jsxs(Badge, { variant: "secondary", className: "text-lg px-4 py-2", children: [getUserCount('teacher'), " Total"] }) }), _jsx(Button, { className: "w-full bg-green-600 hover:bg-green-700 transition-colors duration-300", children: "Manage Teachers" })] }) }), _jsx(Card, { className: "p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group", onClick: () => handleViewUsers('admin'), children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300", children: _jsx(Shield, { className: "h-8 w-8 text-white" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Administrators" }), _jsx("p", { className: "text-gray-600 mb-4", children: "System administrators and staff" }), _jsx("div", { className: "flex justify-center mb-4", children: _jsxs(Badge, { variant: "secondary", className: "text-lg px-4 py-2", children: [getUserCount('admin'), " Total"] }) }), _jsx(Button, { className: "w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300", children: "Manage Admins" })] }) })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Statistics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-blue-50 rounded-xl", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: getUserCount('student') }), _jsx("div", { className: "text-sm text-blue-700", children: "Active Students" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 rounded-xl", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: getUserCount('teacher') }), _jsx("div", { className: "text-sm text-green-700", children: "Faculty Members" })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 rounded-xl", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: getUserCount('admin') }), _jsx("div", { className: "text-sm text-purple-700", children: "Administrators" })] }), _jsxs("div", { className: "text-center p-4 bg-gray-50 rounded-xl", children: [_jsx("div", { className: "text-2xl font-bold text-gray-600", children: userStats.totalUsers }), _jsx("div", { className: "text-sm text-gray-700", children: "Total Users" })] })] })] })] }));
    }
    // Users list view
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "outline", onClick: handleBackToCategories, className: "flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Categories"] }), _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900 capitalize", children: [selectedRole, "s Management"] }), _jsxs("p", { className: "text-gray-600", children: ["Manage ", selectedRole, "s in the system"] })] })] }), _jsx(Card, { className: "p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center justify-between", children: [_jsxs("div", { className: "flex flex-1 gap-4 items-center", children: [_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx(Input, { placeholder: "Search users...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }), selectedRole === 'student' && (_jsxs("select", { value: filterYear, onChange: (e) => setFilterYear(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Years" }), _jsx("option", { value: "MD-1", children: "MD-1" }), _jsx("option", { value: "MD-2", children: "MD-2" }), _jsx("option", { value: "MD-3", children: "MD-3" }), _jsx("option", { value: "MD-4", children: "MD-4" })] })), selectedRole === 'teacher' && (_jsxs("select", { value: filterDepartment, onChange: (e) => setFilterDepartment(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Departments" }), _jsx("option", { value: "Internal Medicine", children: "Internal Medicine" }), _jsx("option", { value: "Surgery", children: "Surgery" }), _jsx("option", { value: "Pediatrics", children: "Pediatrics" }), _jsx("option", { value: "Psychiatry", children: "Psychiatry" })] }))] }), _jsxs(Button, { onClick: handleAddUser, className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "h-4 w-4" }), "Add ", selectedRole] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredUsers.map((user) => (_jsxs(Card, { className: "p-6 hover:shadow-lg transition-shadow duration-300", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center", children: _jsx(User, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: user.name }), _jsx(Badge, { variant: user.status === 'active' ? 'success' : 'error', children: user.status })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => handleEditUser(user), children: _jsx(Edit2, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => user.id && handleDeleteUser(user.id), className: "text-red-600 hover:text-red-700", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }), _jsxs("div", { className: "space-y-2 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-4 w-4" }), _jsx("span", { children: user.email })] }), user.phone && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "h-4 w-4" }), _jsx("span", { children: user.phone })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["Joined ", user.createdAt instanceof Date
                                                    ? user.createdAt.toLocaleDateString()
                                                    : user.createdAt.toDate().toLocaleDateString()] })] }), user.role === 'student' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(GraduationCap, { className: "h-4 w-4" }), _jsxs("span", { children: [user.mdYear, " - ID: ", user.studentId] })] }), user.gpa && (_jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { className: "font-medium", children: ["GPA: ", user.gpa] }) }))] })), user.role === 'teacher' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BookOpen, { className: "h-4 w-4" }), _jsx("span", { children: user.department })] }), user.specialization && (_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "font-medium", children: user.specialization }) })), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { className: "text-xs", children: ["ID: ", user.employeeId] }) })] })), user.role === 'admin' && (_jsx(_Fragment, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-4 w-4" }), _jsxs(Badge, { variant: user.adminLevel === 'super' ? 'default' : 'secondary', children: [user.adminLevel, " Admin"] })] }) }))] })] }, user.id))) }), filteredUsers.length === 0 && (_jsxs(Card, { className: "p-8 text-center", children: [_jsx(Users, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No users found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search or filter criteria." })] })), showAddModal && (_jsx(UserModal, { user: editingUser, role: selectedRole, onClose: () => setShowAddModal(false), onSave: async (userData) => {
                    try {
                        console.log('💾 Saving user data:', userData);
                        if (editingUser) {
                            // Update existing user
                            console.log('📝 Updating user:', editingUser.id);
                            await updateUser(editingUser.id, userData);
                            console.log('✅ User updated successfully');
                            alert('User updated successfully');
                        }
                        else {
                            // Create new user
                            console.log('👤 Creating new user...');
                            // Validate that password is present for new users
                            if (!userData.password || userData.password.trim() === '') {
                                throw new Error('Password is required for new users');
                            }
                            console.log('🔐 Password provided:', userData.password ? 'Yes' : 'No');
                            console.log('📧 Email:', userData.email);
                            console.log('👤 Name:', userData.name);
                            console.log('🎭 Role:', userData.role);
                            const newUser = await createUserWithoutSignIn(userData);
                            console.log('✅ User created successfully:', newUser);
                            alert('User created successfully');
                        }
                        setShowAddModal(false);
                        console.log('🔄 Reloading users...');
                        await loadUsers(); // Reload users
                        await loadUserStats(); // Update statistics
                        console.log('✅ Data reloaded');
                    }
                    catch (err) {
                        console.error('❌ Error saving user:', err);
                        console.error('❌ Full error object:', err);
                        // Show more detailed error message
                        let errorMessage = 'Unknown error';
                        if (err instanceof Error) {
                            errorMessage = err.message;
                            console.error('❌ Error message:', err.message);
                            console.error('❌ Error stack:', err.stack);
                        }
                        alert('Failed to save user: ' + errorMessage);
                    }
                } }))] }));
}
function UserModal({ user, role, onClose, onSave }) {
    console.log('🔧 UserModal props:', { user, role, isNewUser: !user });
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '', // Only for new users
        phone: user?.phone || '',
        status: user?.status || 'active',
        // Student fields
        mdYear: user?.mdYear || 'MD-1',
        studentId: user?.studentId || '',
        gpa: user?.gpa || 0,
        // Teacher fields
        department: user?.department || '',
        specialization: user?.specialization || '',
        employeeId: user?.employeeId || '',
        // Admin fields
        adminLevel: user?.adminLevel || 'regular',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate required fields
        if (!formData.name || !formData.email) {
            alert('Name and email are required');
            return;
        }
        // For new users, password is required
        if (!user && !formData.password) {
            alert('Password is required for new users');
            return;
        }
        // If password is provided, validate length
        if (formData.password && formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        console.log('📝 Form data being submitted:', { ...formData, role });
        onSave({ ...formData, role });
    };
    const handleInputChange = (field, value) => {
        console.log(`📝 Field changed: ${field} = ${value}`);
        const newFormData = { ...formData, [field]: value };
        console.log('📋 Updated form data:', newFormData);
        setFormData(newFormData);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b", children: _jsxs("h2", { className: "text-xl font-bold text-gray-900", children: [user ? 'Edit' : 'Add', " ", role] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name" }), _jsx(Input, { value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx(Input, { type: "email", value: formData.email, onChange: (e) => handleInputChange('email', e.target.value), required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Password ", _jsx("span", { className: "text-red-500", children: "*" }), user ? ' (Leave blank to keep current)' : ' (Required for new users)'] }), _jsx(Input, { type: "password", value: formData.password, onChange: (e) => {
                                        console.log('🔑 Password field changed:', e.target.value);
                                        handleInputChange('password', e.target.value);
                                    }, required: !user, minLength: 6, placeholder: user ? "Leave blank to keep current password" : "Minimum 6 characters" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Current password: ", formData.password ? '✅ Provided' : '❌ Missing'] })] }), _jsxs("div", { className: "p-2 bg-gray-100 rounded text-xs text-gray-600", children: ["Debug: user=", user ? 'exists' : 'null', ", isNewUser=", !user ? 'yes' : 'no'] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), _jsx(Input, { value: formData.phone, onChange: (e) => handleInputChange('phone', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { value: formData.status, onChange: (e) => handleInputChange('status', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "suspended", children: "Suspended" })] })] }), role === 'student' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "MD Year" }), _jsxs("select", { value: formData.mdYear, onChange: (e) => handleInputChange('mdYear', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "MD-1", children: "MD-1" }), _jsx("option", { value: "MD-2", children: "MD-2" }), _jsx("option", { value: "MD-3", children: "MD-3" }), _jsx("option", { value: "MD-4", children: "MD-4" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Student ID" }), _jsx(Input, { value: formData.studentId, onChange: (e) => handleInputChange('studentId', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "GPA" }), _jsx(Input, { type: "number", step: "0.1", min: "0", max: "4", value: formData.gpa, onChange: (e) => handleInputChange('gpa', parseFloat(e.target.value) || 0) })] })] })), role === 'teacher' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Department" }), _jsxs("select", { value: formData.department, onChange: (e) => handleInputChange('department', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Select Department" }), _jsx("option", { value: "Internal Medicine", children: "Internal Medicine" }), _jsx("option", { value: "Surgery", children: "Surgery" }), _jsx("option", { value: "Pediatrics", children: "Pediatrics" }), _jsx("option", { value: "Psychiatry", children: "Psychiatry" }), _jsx("option", { value: "Emergency Medicine", children: "Emergency Medicine" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Specialization" }), _jsx(Input, { value: formData.specialization, onChange: (e) => handleInputChange('specialization', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Employee ID" }), _jsx(Input, { value: formData.employeeId, onChange: (e) => handleInputChange('employeeId', e.target.value) })] })] })), role === 'admin' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Admin Level" }), _jsxs("select", { value: formData.adminLevel, onChange: (e) => handleInputChange('adminLevel', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "regular", children: "Regular Admin" }), _jsx("option", { value: "super", children: "Super Admin" })] })] })), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, className: "flex-1", children: "Cancel" }), _jsxs(Button, { type: "submit", className: "flex-1", children: [user ? 'Update' : 'Create', " ", role] })] })] })] }) }));
}
