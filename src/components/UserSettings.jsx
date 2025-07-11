import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Lock, Save, UploadCloud } from 'lucide-react';

const UserSettings = () => {
  const { user, updateUser, refreshUsers } = useAuth();
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        userId: user.userId,
        email: user.email || '',
        avatar: user.avatar || null,
      }));
      setAvatarPreview(user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=8b45ff&color=fff&size=128`);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: 'Image too large',
          description: 'Please select an image smaller than 2MB.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const updates = {
      name: formData.fullName,
      email: formData.email,
    };

    if (formData.avatar && formData.avatar !== user?.avatar) {
      updates.avatar = formData.avatar;
    }


    if (formData.newPassword) {
      updates.newPassword = formData.newPassword;
    }

    try {
      const result = await updateUser(user.userId, formData);
      if (result.success) {
        toast({
          title: 'Settings Updated',
          description: 'Your profile information has been successfully updated.',
        });
        if (typeof refreshUsers === 'function') {
          refreshUsers();
        }
        setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      } else {
        toast({
          title: 'Update Failed',
          description: result.error || 'Could not update your settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p className="text-white">Loading settings...</p>;
  }
  console.log('user ', user)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-4 sm:p-6"
    >
      <Card className="visa-card">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Account Settings</CardTitle>
          <CardDescription className="text-purple-300">
            Manage your personal information, avatar, and password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 pb-6 border-b border-purple-500/20">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-purple-400/50 relative group">
              <AvatarImage src={avatarPreview} alt={formData.fullName} />
              <AvatarFallback className="text-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {formData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700 border-purple-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
                title="Change avatar"
              >
                <UploadCloud className="h-4 w-4" />
              </Button>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            <div>
              <h3 className="text-xl font-semibold text-white text-center sm:text-left">{formData.fullName}</h3>
              <p className="text-sm text-purple-300 text-center sm:text-left">{formData.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white flex items-center">
                <User className="h-4 w-4 mr-2 text-purple-400" /> Full Name
              </Label>
              <Input
                id="name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center">
                <Mail className="h-4 w-4 mr-2 text-purple-400" /> Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                placeholder="your.email@example.com"
                required
              />
            </div>



            <div className="border-t border-purple-500/20 pt-6 space-y-6">
              <h4 className="text-lg font-semibold text-white">Change Password</h4>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-purple-400" /> Current Password
                </Label>
                <Input
                  id="newPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-purple-400" /> New Password
                </Label>
                <Input
                  id="password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-purple-400" /> Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
                  placeholder="Confirm your new password"
                  disabled={!formData.newPassword}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bolt-gradient hover:scale-105 transition-transform min-w-[120px]" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserSettings;