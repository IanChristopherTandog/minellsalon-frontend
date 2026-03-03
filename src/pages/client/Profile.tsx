import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="card-luxury p-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue={user?.name} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email} type="email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue={user?.phone} />
          </div>
        </div>
        <Button className="mt-6">Save Changes</Button>
      </div>

      <div className="card-luxury p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" />
          </div>
          <Button>Update Password</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
