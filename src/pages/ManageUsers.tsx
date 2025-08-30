import React, { useState, useEffect, useCallback } from 'react';
import { useRole } from '../hooks/useRole';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  getAllUsers,
  getUsersByRole, 
  createUserWithoutSignIn,
  updateUser, 
  deleteUserProfile, 
  getUserStats
} from '../lib/users';
import type {
  UserProfile,
  CreateUserInput
} from '../lib/users';
import { seedUsersData } from '../lib/seedUsers';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowLeft,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  User
} from 'lucide-react';

// Type alias for consistency
type UserData = UserProfile;

type ViewMode = 'categories' | 'users';
type UserRole = 'student' | 'teacher' | 'admin';

export default function ManageUsers() {
  const { role } = useRole();
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  
  // Firebase data state
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    activeUsers: 0
  });
  const [error, setError] = useState<string | null>(null);

  // Load users based on selected role or all users
  const loadUsers = useCallback(async () => {
    try {
      console.log('📊 Loading users...', selectedRole ? `Role: ${selectedRole}` : 'All users');
      setLoading(true);
      setError(null);
      
      let userData: UserData[];
      if (selectedRole) {
        userData = await getUsersByRole(selectedRole);
        console.log(`📋 Loaded ${userData.length} ${selectedRole}s:`, userData);
      } else {
        userData = await getAllUsers();
        console.log(`📋 Loaded ${userData.length} total users:`, userData);
      }
      
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('❌ Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  // Load user statistics
  const loadUserStats = async () => {
    try {
      console.log('📈 Loading user statistics...');
      const stats = await getUserStats();
      console.log('📊 User stats loaded:', stats);
      setUserStats(stats);
    } catch (err) {
      console.error('❌ Error loading user stats:', err);
    }
  };

  // Initialize data on component mount
  const initializeData = useCallback(async () => {
    try {
      // Seed initial data if needed
      await seedUsersData();
      
      // Load users and stats
      await loadUsers();
      await loadUserStats();
    } catch (error) {
      console.error('Error initializing data:', error);
      setError('Failed to initialize user data');
    }
  }, [loadUsers]);

  // Load users data on component mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Reload users when selected role changes
  useEffect(() => {
    if (viewMode === 'users') {
      loadUsers();
    }
  }, [selectedRole, viewMode, loadUsers]);

  // Access control
  if (role !== 'admin') {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <ShieldCheck className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access user management.</p>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    if (selectedRole && user.role !== selectedRole) return false;
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterYear !== 'all' && user.mdYear !== filterYear) return false;
    if (filterDepartment !== 'all' && user.department !== filterDepartment) return false;
    return true;
  });

  const getUserCount = (role: UserRole) => {
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

  const handleViewUsers = (role: UserRole) => {
    setSelectedRole(role);
    setViewMode('users');
  };

  const handleAddUser = () => {
    console.log('➕ Adding new user - setting editingUser to null');
    setEditingUser(null);
    setShowAddModal(true);
    console.log('📝 Modal state:', { editingUser: null, showAddModal: true });
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUserProfile(userId);
      await loadUsers(); // Reload users after deletion
      await loadUserStats(); // Update statistics
      alert('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Loading state
  if (loading && viewMode === 'categories') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading user data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Users</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadUsers()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (viewMode === 'categories') {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage students, teachers, and administrators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students Card */}
          <Card className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleViewUsers('student')}>
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Students</h3>
              <p className="text-gray-600 mb-4">Medical students enrolled in the program</p>
              <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {getUserCount('student')} Total
                </Badge>
              </div>
              <Button className="w-full group-hover:bg-blue-600 transition-colors duration-300">
                Manage Students
              </Button>
            </div>
          </Card>

          {/* Teachers Card */}
          <Card className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleViewUsers('teacher')}>
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Teachers</h3>
              <p className="text-gray-600 mb-4">Faculty members and instructors</p>
              <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {getUserCount('teacher')} Total
                </Badge>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300">
                Manage Teachers
              </Button>
            </div>
          </Card>

          {/* Admins Card */}
          <Card className="p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleViewUsers('admin')}>
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Administrators</h3>
              <p className="text-gray-600 mb-4">System administrators and staff</p>
              <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {getUserCount('admin')} Total
                </Badge>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
                Manage Admins
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{getUserCount('student')}</div>
              <div className="text-sm text-blue-700">Active Students</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{getUserCount('teacher')}</div>
              <div className="text-sm text-green-700">Faculty Members</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{getUserCount('admin')}</div>
              <div className="text-sm text-purple-700">Administrators</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-600">{userStats.totalUsers}</div>
              <div className="text-sm text-gray-700">Total Users</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Users list view
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={handleBackToCategories}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {selectedRole}s Management
          </h1>
          <p className="text-gray-600">
            Manage {selectedRole}s in the system
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {selectedRole === 'student' && (
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`).map(mdYear => (
                  <option key={mdYear} value={mdYear}>{mdYear}</option>
                ))}
              </select>
            )}
            
            {selectedRole === 'teacher' && (
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Surgery">Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
              </select>
            )}
          </div>
          
          <Button onClick={handleAddUser} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add {selectedRole}
          </Button>
        </div>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => user.id && handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {user.createdAt instanceof Date 
                  ? user.createdAt.toLocaleDateString() 
                  : user.createdAt.toDate().toLocaleDateString()}</span>
              </div>

              {/* Role-specific information */}
              {user.role === 'student' && (
                <>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{user.mdYear} - ID: {user.studentId}</span>
                  </div>
                  {user.gpa && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">GPA: {user.gpa}</span>
                    </div>
                  )}
                </>
              )}

              {user.role === 'teacher' && (
                <>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{user.department}</span>
                  </div>
                  {user.specialization && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.specialization}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs">ID: {user.employeeId}</span>
                  </div>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <Badge variant={user.adminLevel === 'super' ? 'default' : 'secondary'}>
                      {user.adminLevel} Admin
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </Card>
      )}

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <UserModal
          user={editingUser}
          role={selectedRole!}
          onClose={() => setShowAddModal(false)}
          onSave={async (userData) => {
            try {
              console.log('💾 Saving user data:', userData);
              
              if (editingUser) {
                // Update existing user
                console.log('📝 Updating user:', editingUser.id);
                await updateUser(editingUser.id!, userData);
                console.log('✅ User updated successfully');
                alert('User updated successfully');
              } else {
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
                
                const newUser = await createUserWithoutSignIn(userData as CreateUserInput);
                console.log('✅ User created successfully:', newUser);
                alert('User created successfully');
              }
              
              setShowAddModal(false);
              console.log('🔄 Reloading users...');
              await loadUsers(); // Reload users
              await loadUserStats(); // Update statistics
              console.log('✅ Data reloaded');
            } catch (err) {
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
          }}
        />
      )}
    </div>
  );
}

// User Modal Component
interface UserModalProps {
  user: UserData | null;
  role: UserRole;
  onClose: () => void;
  onSave: (user: Partial<UserData> & { password?: string }) => void;
}

function UserModal({ user, role, onClose, onSave }: UserModalProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleInputChange = (field: string, value: string | number) => {
    console.log(`📝 Field changed: ${field} = ${value}`);
    const newFormData = { ...formData, [field]: value };
    console.log('📋 Updated form data:', newFormData);
    setFormData(newFormData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Edit' : 'Add'} {role}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Common fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          {/* Password field - ALWAYS show for testing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
              {user ? ' (Leave blank to keep current)' : ' (Required for new users)'}
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => {
                console.log('🔑 Password field changed:', e.target.value);
                handleInputChange('password', e.target.value);
              }}
              required={!user} // Required only for new users
              minLength={6}
              placeholder={user ? "Leave blank to keep current password" : "Minimum 6 characters"}
            />
            <p className="text-xs text-gray-500 mt-1">
              Current password: {formData.password ? '✅ Provided' : '❌ Missing'}
            </p>
          </div>
          
          {/* Debug info */}
          <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
            Debug: user={user ? 'exists' : 'null'}, isNewUser={!user ? 'yes' : 'no'}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Role-specific fields */}
          {role === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MD Year</label>
                <select
                  value={formData.mdYear}
                  onChange={(e) => handleInputChange('mdYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`).map(mdYear => (
                    <option key={mdYear} value={mdYear}>{mdYear}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <Input
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value) || 0)}
                />
              </div>
            </>
          )}

          {role === 'teacher' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <Input
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                />
              </div>
            </>
          )}

          {role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Level</label>
              <select
                value={formData.adminLevel}
                onChange={(e) => handleInputChange('adminLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="regular">Regular Admin</option>
                <option value="super">Super Admin</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {user ? 'Update' : 'Create'} {role}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}