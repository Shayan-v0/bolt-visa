import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Badge as BadgeIcon } from 'lucide-react';
import { fetchAllUsers, registerUser, editUser, deleteUser, setPage, setLimit } from '@/store/userSlice';
import CalendarDatePicker from './Calendar';
import Pagination from './Pagination';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error, total, page, limit } = useSelector((state) => state.user);
  
  const [joining_Date, setJoining_Date] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserEditForm, setShowUserEditFForm] = useState(false);
  const [editingUser, setEditingUser] = useState({
    userId: "",
    fullName: "",
    position: "",
    department: "",
    isActive: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    salary: "",
    joiningDate: "",
    empId: ""
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'User',
    department: '',
    position: '',
    salary: "",
    joiningDate: "",
    empId: ""
  });

  // Function to format date to DD-MM-YYYY format
  const formatDateForAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (joining_Date && !showUserEditForm) {
      setFormData((prev) => ({ ...prev, joiningDate: formatDateForAPI(joining_Date)}))
    }
    if (joining_Date && showUserEditForm) {
      setEditingUser((prev) => ({ ...prev, joiningDate: formatDateForAPI(joining_Date)}))
    }
  }, [joining_Date])

  // Fetch users from RTK on component mount
  useEffect(() => {
    console.log('Fetching users with page:', page, 'limit:', limit);
    dispatch(fetchAllUsers({ page, limit }));
  }, [dispatch, page, limit]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const refreshUsers = useCallback(() => {
    console.log('Refreshing users with page:', page, 'limit:', limit);
    dispatch(fetchAllUsers({ page, limit }));
  }, [dispatch, page, limit]);

  // Pagination handlers
  const handlePageChange = useCallback((newPage) => {
    console.log('Changing page to:', newPage);
    dispatch(setPage(newPage));
  }, [dispatch]);

  const handleItemsPerPageChange = useCallback((newLimit) => {
    console.log('Changing limit to:', newLimit);
    dispatch(setLimit(newLimit));
    dispatch(setPage(1)); // Reset to first page when changing limit
  }, [dispatch]);

  // useEffect(() => {
  //   setUsers(systemUsers || []);
  // }, [systemUsers]);

  // const positions = [
  //   'Manager',
  //   'Team Leader',
  //   'Senior Consultant',
  //   'Consultant',
  //   'Junior Consultant',
  //   'Administrative Assistant'
  // ];


  const roles = [
    'User', 'Admin', 'Agent'
  ];

  const positions = [
    'Manager', 'Team Leader', 'Senior Consultant', 'Consultant', 'Junior Consultant', 'Administrative Assistant'
  ];

  const departments = ['Management', 'Visa Consulting', 'Customer Service', 'Marketing', 'Finance', 'Operations'];

  const generateEmployeeId = (position, role) => {
    const prefix = 'BVE';
    let positionCode = 'CON';

    if (role === 'admin' || position === 'Manager') {
      positionCode = 'MNG';
    } else if (position === 'Team Leader') {
      positionCode = 'TL';
    } else if (position === 'Senior Consultant') {
      positionCode = 'SR';
    } else if (position === 'Junior Consultant') {
      positionCode = 'JR';
    } else if (position === 'Administrative Assistant') {
      positionCode = 'ADM';
    }

    const allUsers = JSON.parse(localStorage.getItem('bolt_visa_users') || '[]');
    const existingIds = allUsers
      .filter(u => u.employeeId?.startsWith(`${prefix}-${positionCode}`))
      .map(u => u.employeeId)
      .sort();

    let nextNumber = 1;
    if (existingIds.length > 0) {
      const lastId = existingIds[existingIds.length - 1];
      const lastNumber = parseInt(lastId.split('-')[2], 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    return `${prefix}-${positionCode}-${nextNumber.toString().padStart(4, '0')}`;
  };


  const resetForm = () => {
    // setFormData({
    //   fullName: '',
    //   email: '',
    //   password: '',
    //   role: 'user',
    //   department: '',
    //   position: ''
    // });
    setShowUserEditFForm(false)
    // setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData ....', formData)
    if (!showUserForm && (!formData.position || !formData.department)) {
      toast({
        title: "Missing Information",
        description: "Please select a position and department for the new user.",
        variant: "destructive",
      });
      return;
    }

            try {
          if (showUserEditForm) {
            console.log('editingUser joinin date ', editingUser)
            // Map the editing user data to match API expectations
            const userData = {
              userId: editingUser.userId,
              fullName: editingUser.fullName,
              email: editingUser.email,
              department: editingUser.department,
              position: editingUser.position,
              role: editingUser.role,
              joiningDate: editingUser.joiningDate || formatDateForAPI(joining_Date),
              salary: editingUser.salary,
              empId: editingUser.empId,
              currentPassword: editingUser.currentPassword,
              newPassword: editingUser.newPassword,
              confirmPassword: editingUser.confirmPassword
            };
            const result = await dispatch(editUser(userData)).unwrap();
            console.log('result update user', result)
            if (result.status) {
              toast({ title: "User updated!", description: "User information has been successfully updated." });
              setShowUserForm(false);
              resetForm();
              refreshUsers();
            } else {
              toast({ title: "Update Error", description: result.error || "Failed to update user.", variant: "destructive" });
            }
          } else {
            const employeeId = generateEmployeeId(formData.position, formData.role);
            if (formData.fullName &&
              formData.email &&
              formData.password &&
              formData.role &&
              formData.department &&
              formData.position) {
              // Map the form data to match API expectations
              const userData = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                department: formData.department,
                position: formData.position,
                salary: formData.salary,
                joiningDate: formData.joiningDate || formatDateForAPI(joining_Date),
                empId: formData.empId || employeeId
              };
              const result = await dispatch(registerUser(userData)).unwrap();
              if (result.status) {
                toast({ title: "User created!", description: `New user created with ID: ${employeeId}` });
                setShowUserForm(false);
                resetForm();
                refreshUsers();
              } else {
                toast({ title: "Creation Error", description: result.error || "Failed to create user.", variant: "destructive" });
              }
            }
          }
        } catch (err) {
          console.log('Error:', err);
          toast({ 
            title: "Error", 
            description: err.message || "An error occurred while processing your request.", 
            variant: "destructive" 
          });
        }
  };

  const handleEdit = (user) => {
    console.log('user ', user)
    setShowUserEditFForm(true)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department,
      position: user.position
    });
    setEditingUser(prev => ({
      ...prev,
      userId: user?._id,
      fullName: user.fullName,
      email: user.email,
      department: user.department,
      position: user.position,
      role: user.role,
      joiningDate: user.joiningDate,
      salary: user.salary,
      empId: user.empId
    }))
    setShowUserForm(
      true);
  };

  const handleDelete = async (userId) => {
    try {
      const result = await dispatch(deleteUser(userId)).unwrap();
      if (result.status) {
        toast({ title: "User deleted", description: "User has been successfully removed." });
        refreshUsers();
      } else {
        toast({ title: "Error", description: result.error || "Failed to delete user.", variant: "destructive" });
      }
    } catch (err) {
      console.log('Error:', err);
      toast({ 
        title: "Error", 
        description: err.message || "Failed to delete user.", 
        variant: "destructive" 
      });
    }
  };
  let formattedDate;
  if (showUserEditForm) {

    formattedDate = new Date(editingUser?.joiningDate ).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short', // or 'long' or '2-digit'
      year: 'numeric'
    });
  }

  console.log('formattedDate ', formattedDate)
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-2xl font-bold text-white mb-1">CSR Management</h2>
          <p className="text-purple-300 text-sm">Manage team members and their access levels</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowUserForm(true); setShowUserEditFForm(false) }}
          className="bolt-gradient hover:scale-105 transition-transform w-full sm:w-auto flex-shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="visa-card">
        <CardHeader>
          <CardTitle className="text-white">Team Members</CardTitle>
          <CardDescription className="text-purple-300">
            {loading ? 'Loading users...' : `Showing ${users.length} of ${total} users`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-2 text-purple-300">Loading users...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-purple-300">No users found</p>
                </div>
              ) : (
                users.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors w-full"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0 flex-grow min-w-0">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=8b45ff&color=fff`} alt={user.fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-grow">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate" title={user.fullName}>{user.fullName}</h3>
                    <p className="text-xs sm:text-sm text-purple-300 truncate" title={user.email}>{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1 flex-wrap">
                      <Badge className={`${user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'} text-xxs sm:text-xs`}>
                        {user.role}
                      </Badge>
                      <span className="text-xxs sm:text-xs text-purple-400 truncate" title={user.position}>{user.position}</span>
                    </div>
                    <div className="flex items-center text-xxs sm:text-xs text-purple-400 mt-1">
                      <BadgeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                      {user.empId}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
                  <div className="text-right sm:text-center w-full sm:w-auto min-w-[80px]">
                    <p className="text-xs sm:text-sm text-white font-semibold truncate" title={user.department}>{user.department}</p>
                    <p className="text-xxs sm:text-xs text-purple-300">Department</p>
                  </div>
                  <div className="text-right sm:text-center w-full sm:w-auto min-w-[80px]">
                    <p className="text-xs sm:text-sm text-white font-semibold">{user.reward?.toLocaleString() || 0} PKR</p>
                    <p className="text-xxs sm:text-xs text-purple-300">Rewards</p>
                  </div>
                  <div className="flex space-x-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(user)}
                      className="border-purple-500/20 text-white hover:bg-purple-500/10 h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(user._id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 w-8 sm:h-9 sm:w-9"
                      disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / limit)}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <Dialog open={showUserForm} onOpenChange={(isOpen) => { if (!isOpen) resetForm(); setShowUserForm(isOpen); }}>
        <DialogContent className="glass-effect border-purple-500/20 text-white max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-white">
              {showUserEditForm ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription className="text-purple-300">
              {showUserEditForm ? 'Update user information' : 'Create a new team member account'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                value={showUserEditForm ? editingUser?.fullName : formData.fullName}
                onChange={showUserEditForm ? (e) => setEditingUser(prev => ({ ...prev, fullName: e.target.value })) : (e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name"
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={showUserEditForm ? editingUser?.email : formData.email}
                onChange={showUserEditForm ? (e) => setEditingUser(prev => ({ ...prev, email: e.target.value })) : (e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                required
              />
            </div>
            {/* salary */}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Salary</Label>
              <Input
                id="salary"
                type="number"
                value={showUserEditForm ? editingUser?.salary : formData.salary}
                onChange={showUserEditForm ? (e) => setEditingUser(prev => ({ ...prev, salary: e.target.value })) : (e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="Enter salary"
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                required
              />
            </div>

            {/* emp id */}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Employ Id</Label>
              <Input
                id="empId"
                type="text"
                value={showUserEditForm ? editingUser?.empId : formData.empId}
                onChange={showUserEditForm ? (e) => setEditingUser(prev => ({ ...prev, empId: e.target.value })) : (e) => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                placeholder="Enter employ id"
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                required
              />
            </div>

            {
              showUserEditForm ?
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      leave blank to keep current
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={editingUser.currentPassword}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter password"
                      className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                      required={!showUserEditForm}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={editingUser.newPassword}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter password"
                      className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                      required={!showUserEditForm}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Confirm Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={editingUser.confirmPassword}
                      onChange={(e) => setEditingUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Enter password"
                      className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                      required={!showUserEditForm}
                    />
                  </div>
                </>
                :
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    {showUserEditForm ? 'New Password (leave blank to keep current)' : 'Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                    required={!showUserEditForm}
                  />
                </div>

            }

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Role</Label>
                <Select value={showUserEditForm ? editingUser.role : formData.role} onValueChange={showUserEditForm ? (value) => setEditingUser(prev => ({ ...prev, role: value })) : (value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-purple-500/20">
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Position</Label>
                <Select value={showUserEditForm ? editingUser.position : formData.position} onValueChange={showUserEditForm ? (value) => setEditingUser(prev => ({ ...prev, position: value })) : (value) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-purple-500/20">
                    {positions.map(position => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">Department</Label>
                <Select value={showUserEditForm ? editingUser.department : formData.department} onValueChange={showUserEditForm ? (value) => setEditingUser(prev => ({ ...prev, department: value })) : (value) => setFormData(prev => ({ ...prev, department: value }))} >
                  <SelectTrigger className="glass-effect border-purple-500/20 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-purple-500/20">
                    {departments.map(department => (
                      <SelectItem key={department} value={department}>{department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calendar" className="text-white">Joining Date</Label>
                <div className='w-full h-[60%] bg-blue-500 mt-5 rounded-lg flex justify-around items-center'>
                  <Label htmlFor="calendar" className="text-white">{joining_Date ? joining_Date?.toLocaleDateString() : showUserEditForm ? formattedDate : 'dd/mm/yyyy'}</Label>

                  <CalendarDatePicker userDate={joining_Date ? joining_Date : showUserEditForm ? editingUser?.joiningDate : ''} setJoining_Date={setJoining_Date} />
                </div>
                {/* {joining_Date && <Label htmlFor="calendar" className="text-purple-400">{joining_Date}</Label>} */}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowUserForm(false);
                  resetForm();
                  setShowUserEditFForm(false)
                }}
                className="border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bolt-gradient hover:scale-105 transition-transform"

              >
                {showUserEditForm ? 'Update' : 'Create'} User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;