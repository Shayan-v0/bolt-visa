import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User, Mail, Briefcase, Building, ShieldCheck, Award, Globe, Pencil, Check, Wallet, Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const UserProfile = () => {
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || '');
  const [country, setCountry] = useState(user?.country || '');
  const [editingField, setEditingField] = useState(null);

  const [passportFile, setPassportFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const formattedDate = new Date(user.joining_date).toDateString()
  console.log('formattedDate ', formattedDate)
  const handleSave = () => {
    alert('Profile updated (demo only)');
  };

  const handleFieldSave = () => {
    setEditingField(null);
  };

  const renderFilePreview = (file) => {
    if (!file) return null;
    const fileURL = URL.createObjectURL(file);
    if (file.type.startsWith('image')) {
      return (
        <div className="mt-2">
          <img src={fileURL} alt="Preview" className="w-24 h-24 object-cover rounded border border-purple-500" />
          <Button size="sm" className="mt-1" onClick={() => window.open(fileURL, '_blank')}>View Full</Button>
        </div>
      );
    }
    return (
      <div className="mt-2">
        <p className="text-sm text-purple-300">{file.name}</p>
        <Button size="sm" className="mt-1" onClick={() => window.open(fileURL, '_blank')}>View File</Button>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg">Loading user profile...</p>
      </div>
    );
  }

  const getAvatarSrc = () => {
    if (user?.avatar) return user.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a0033&color=fff&size=128`;
  };

  const renderEditableItem = (label, value, field, setter) => {
    return (
      <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
        <div className="flex-shrink-0 mt-1">
          {field === 'email' ? <Mail className="h-5 w-5 text-purple-400" /> : <Globe className="h-5 w-5 text-purple-400" />}
        </div>
        <div className="w-full">
          <p className="text-xs text-purple-300">{label}</p>
          {editingField === field ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                className="bg-purple-900/30 border-purple-500/50 text-white text-sm"
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
              <Check
                className="text-green-400 cursor-pointer hover:text-white"
                onClick={handleFieldSave}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white truncate" title={value}>{value}</p>
              <Pencil
                className="text-purple-400 h-4 w-4 cursor-pointer hover:text-white"
                onClick={() => setEditingField(field)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  console.log('user profile ', user)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto p-4 sm:p-6">
      <Card className="visa-card overflow-hidden">
        <CardHeader className="p-6 bg-gradient-to-br from-purple-600 to-pink-500/30">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-purple-400/50 shadow-lg">
              <AvatarImage src={getAvatarSrc()} alt={user.fullName} />
              <AvatarFallback className="text-4xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{user.name}</CardTitle>
              <CardDescription className="text-purple-200 text-base sm:text-lg mt-1">
                {user.position} at Bolt Visa Express
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-shrink-0 mt-1"><User className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-xs text-purple-300">Full Name</p>
                  <p className="text-sm font-medium text-white truncate" title={user.fullName}>{user.fullName}</p>
                </div>
              </div>

              {renderEditableItem('Email Address', email, 'email', setEmail)}
              <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-shrink-0 mt-1"><Briefcase className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-xs text-purple-300">Position</p>
                  <p className="text-sm font-medium text-white truncate">{user.position || 'Not Set'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-shrink-0 mt-1"><Building className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-xs text-purple-300">Department</p>
                  <p className="text-sm font-medium text-white truncate">{user.department || 'Not Set'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-shrink-0 mt-1"><ShieldCheck className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-xs text-purple-300">Role</p>
                  <p className="text-sm font-medium text-white truncate">{user.role}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-shrink-0 mt-1"><Award className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-xs text-purple-300">Employee ID</p>
                  <p className="text-sm font-medium text-white truncate">{user.empId || 'N/A'}</p>
                </div>
              </div>
              {/* {renderEditableItem('Country', country, 'country', setCountry)} */}
              <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-shrink-0 mt-1"><Wallet className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-xs text-purple-300">Salary</p>
                  <p className="text-sm font-medium text-white truncate">{user.salary || 'Tourist'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-shrink-0 mt-1"><Calendar className="h-5 w-5 text-purple-400" /></div>
                <div>
                  <p className="text-xs text-purple-300">Joining date</p>
                  <p className="text-sm font-medium text-white truncate">{formattedDate || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          {/* 
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Upload Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-purple-400">Passport</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={e => setPassportFile(e.target.files[0])} />
                {renderFilePreview(passportFile)}
              </div>
              <div>
                <Label className="text-purple-400">National ID</Label>
                <Input type="file" accept=".pdf,.jpg,.png" onChange={e => setIdFile(e.target.files[0])} />
                {renderFilePreview(idFile)}
              </div>
              <div>
                <Label className="text-purple-400">Photograph</Label>
                <Input type="file" accept=".jpg,.png" onChange={e => setPhotoFile(e.target.files[0])} />
                {renderFilePreview(photoFile)}
              </div>
            </div>
          </div> */}
          {/* 
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Attendance Track</h3>
            <p className="text-purple-400">Coming soon: full attendance calendar integration.</p>
          </div> */}

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bolt-gradient">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;