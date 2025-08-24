import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Shield, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

// Mock data - replace with actual Firebase data
const mockUsers = {
  students: [
    { id: 1, name: "Sarah Johnson", email: "sarah.johnson@jfk.edu", mdYear: "MD-1", status: "active", phone: "+1 (555) 123-4567", location: "New York", joinDate: "2024-08-15" },
    { id: 2, name: "Michael Chen", email: "michael.chen@jfk.edu", mdYear: "MD-2", status: "active", phone: "+1 (555) 234-5678", location: "Boston", joinDate: "2023-08-15" },
    { id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@jfk.edu", mdYear: "MD-3", status: "active", phone: "+1 (555) 345-6789", location: "Chicago", joinDate: "2022-08-15" },
    { id: 4, name: "David Kim", email: "david.kim@jfk.edu", mdYear: "MD-4", status: "active", phone: "+1 (555) 456-7890", location: "Los Angeles", joinDate: "2021-08-15" },
    { id: 5, name: "Lisa Wang", email: "lisa.wang@jfk.edu", mdYear: "MD-1", status: "inactive", phone: "+1 (555) 567-8901", location: "San Francisco", joinDate: "2024-08-15" },
  ],
  teachers: [
    { id: 1, name: "Dr. Robert Smith", email: "robert.smith@jfk.edu", department: "Anatomy", status: "active", phone: "+1 (555) 111-2222", location: "New York", joinDate: "2020-01-15" },
    { id: 2, name: "Dr. Maria Garcia", email: "maria.garcia@jfk.edu", department: "Physiology", status: "active", phone: "+1 (555) 222-3333", location: "Boston", joinDate: "2019-03-20" },
    { id: 3, name: "Dr. James Wilson", email: "james.wilson@jfk.edu", department: "Cardiology", status: "active", phone: "+1 (555) 333-4444", location: "Chicago", joinDate: "2018-06-10" },
    { id: 4, name: "Dr. Jennifer Lee", email: "jennifer.lee@jfk.edu", department: "Neurology", status: "inactive", phone: "+1 (555) 444-5555", location: "Los Angeles", joinDate: "2021-09-05" },
  ],
  admins: [
    { id: 1, name: "Admin Johnson", email: "admin.johnson@jfk.edu", role: "System Admin", status: "active", phone: "+1 (555) 999-8888", location: "New York", joinDate: "2015-01-01" },
    { id: 2, name: "Admin Davis", email: "admin.davis@jfk.edu", role: "Academic Admin", status: "active", phone: "+1 (555) 888-7777", location: "Boston", joinDate: "2016-03-15" },
  ]
};

const MD_YEARS = ["MD-1", "MD-2", "MD-3", "MD-4"];
const DEPARTMENTS = ["Anatomy", "Physiology", "Cardiology", "Neurology", "Pediatrics", "Surgery", "Emergency Medicine"];

export default function ManageUsers() {
  const { role, loading } = useRole();
  const [selectedCategory, setSelectedCategory] = useState<'students' | 'teachers' | 'admins' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterOptions, setFilterOptions] = useState<string[]>([]);

  // Set filter options based on selected category
  useEffect(() => {
    if (selectedCategory === 'students') {
      setFilterOptions(MD_YEARS);
    } else if (selectedCategory === 'teachers') {
      setFilterOptions(DEPARTMENTS);
    } else {
      setFilterOptions([]);
    }
    setSelectedFilter("");
  }, [selectedCategory]);

  // Filter users based on search and filter
  const getFilteredUsers = () => {
    if (!selectedCategory) return [];
    
    let users = mockUsers[selectedCategory];
    
    if (searchTerm) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFilter) {
      if (selectedCategory === 'students') {
        users = users.filter(user => user.mdYear === selectedFilter);
      } else if (selectedCategory === 'teachers') {
        users = users.filter(user => user.department === selectedFilter);
      }
    }
    
    return users;
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <Shield size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need admin privileges to access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Users"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Manage Users' }]}
        actions={
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            Add New User
          </Button>
        }
      />

      {!selectedCategory ? (
        // Category Selection View
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer interactive" onClick={() => setSelectedCategory('students')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-glow">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 mt-4">Students</CardTitle>
              <p className="text-slate-600 text-sm">Manage student accounts and academic progress</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{mockUsers.students.length} students</span>
                </div>
                <Badge variant="default" className="bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer interactive" onClick={() => setSelectedCategory('teachers')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-glow">
                  <UserCheck size={24} className="text-white" />
                </div>
                <ChevronRight size={20} className="text-slate-400 group-hover:text-green-500 transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 mt-4">Teachers</CardTitle>
              <p className="text-slate-600 text-sm">Manage faculty accounts and course assignments</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{mockUsers.teachers.length} teachers</span>
                </div>
                <Badge variant="default" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admins Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer interactive" onClick={() => setSelectedCategory('admins')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow">
                  <Shield size={24} className="text-white" />
                </div>
                <ChevronRight size={20} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 mt-4">Administrators</CardTitle>
              <p className="text-slate-600 text-sm">Manage system administrators and permissions</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{mockUsers.admins.length} admins</span>
                </div>
                <Badge variant="default" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // User List View
        <div className="space-y-6">
          {/* Header with back button and search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2"
              >
                <ChevronRight size={16} className="rotate-180" />
                Back to Categories
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 capitalize">{selectedCategory}</h2>
                <p className="text-slate-600">{filteredUsers.length} users found</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              {/* Filter */}
              {filterOptions.length > 0 && (
                <div className="relative">
                  <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none bg-white w-full sm:w-48"
                  >
                    <option value="">All {selectedCategory === 'students' ? 'MD Years' : 'Departments'}</option>
                    {filterOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-800 mb-1">{user.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{user.phone}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'secondary'}
                      className={user.status === 'active' 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
                        : 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200'
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* User specific info */}
                    {selectedCategory === 'students' && (
                      <div className="flex items-center gap-2">
                        <GraduationCap size={14} className="text-blue-500" />
                        <span className="text-sm font-medium text-slate-700">{user.mdYear}</span>
                      </div>
                    )}
                    {selectedCategory === 'teachers' && (
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-green-500" />
                        <span className="text-sm font-medium text-slate-700">{user.department}</span>
                      </div>
                    )}
                    {selectedCategory === 'admins' && (
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-purple-500" />
                        <span className="text-sm font-medium text-slate-700">{user.role}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{user.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Eye size={14} />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                <Users size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No users found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
