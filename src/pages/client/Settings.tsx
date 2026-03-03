import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Shield, Palette, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettingsModal } from '@/components/modals/NotificationSettingsModal';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    promotionalEmails: false,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Setting updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <div className="card-luxury p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">Configure how you receive updates</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch 
              checked={settings.emailNotifications} 
              onCheckedChange={() => handleToggle('emailNotifications')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via text message</p>
            </div>
            <Switch 
              checked={settings.smsNotifications} 
              onCheckedChange={() => handleToggle('smsNotifications')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded before your appointments</p>
            </div>
            <Switch 
              checked={settings.appointmentReminders} 
              onCheckedChange={() => handleToggle('appointmentReminders')} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Promotional Emails</Label>
              <p className="text-sm text-muted-foreground">Receive offers and promotions</p>
            </div>
            <Switch 
              checked={settings.promotionalEmails} 
              onCheckedChange={() => handleToggle('promotionalEmails')} 
            />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setNotificationModalOpen(true)}
        >
          Advanced Notification Settings
        </Button>
      </div>

      {/* Privacy */}
      <div className="card-luxury p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
            <p className="text-sm text-muted-foreground">Manage your security preferences</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            Delete Account
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="card-luxury p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">Customize how the app looks</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Use dark theme</p>
          </div>
          <Switch 
            checked={settings.darkMode} 
            onCheckedChange={() => handleToggle('darkMode')} 
          />
        </div>
      </div>

      {/* Language */}
      <div className="card-luxury p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Language & Region</h2>
            <p className="text-sm text-muted-foreground">Set your preferred language</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full justify-start">
          English (US)
        </Button>
      </div>
      
      <NotificationSettingsModal 
        open={notificationModalOpen} 
        onOpenChange={setNotificationModalOpen} 
      />
    </div>
  );
};

export default Settings;
