import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Shield } from 'lucide-react';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;

    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: profileData.name
      });

      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), {
        name: profileData.name
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <section className="py-16 bg-gaming-dark min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
            <p className="text-gray-400 text-lg">Manage your account information and preferences</p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center border-b border-gray-700">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-gaming-primary">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gaming-primary text-white text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-white">{user.name}</CardTitle>
                  <p className="text-gray-400">{user.email}</p>
                  {user.role === 'admin' && (
                    <div className="flex items-center justify-center mt-2">
                      <Shield className="h-4 w-4 text-gaming-warning mr-1" />
                      <span className="text-gaming-warning text-sm font-medium">Administrator</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-gaming-primary">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-gaming-primary">
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white focus:ring-gaming-primary focus:border-gaming-primary"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          className="bg-gray-700 border-gray-600 text-white cursor-not-allowed opacity-50"
                          disabled
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gaming-primary hover:bg-blue-600 text-white"
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white focus:ring-gaming-primary focus:border-gaming-primary"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white focus:ring-gaming-primary focus:border-gaming-primary"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white focus:ring-gaming-primary focus:border-gaming-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gaming-accent hover:bg-green-600 text-white"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Danger Zone */}
              <div className="border-t border-gray-700 pt-6 mt-8">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
