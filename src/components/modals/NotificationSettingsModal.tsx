import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    appointmentConfirmed: true,
    appointmentCancelled: true,
    appointmentReminder24h: true,
    appointmentReminder1h: true,
    promotions: false,
    newsletter: false,
    newServices: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Choose which notifications you'd like to receive.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Appointments</h4>
            
            <div className="flex items-center justify-between">
              <Label className="font-normal">Appointment confirmed</Label>
              <Switch 
                checked={settings.appointmentConfirmed} 
                onCheckedChange={() => handleToggle('appointmentConfirmed')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal">Appointment cancelled</Label>
              <Switch 
                checked={settings.appointmentCancelled} 
                onCheckedChange={() => handleToggle('appointmentCancelled')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal">24-hour reminder</Label>
              <Switch 
                checked={settings.appointmentReminder24h} 
                onCheckedChange={() => handleToggle('appointmentReminder24h')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal">1-hour reminder</Label>
              <Switch 
                checked={settings.appointmentReminder1h} 
                onCheckedChange={() => handleToggle('appointmentReminder1h')} 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">Marketing</h4>
            
            <div className="flex items-center justify-between">
              <Label className="font-normal">Promotions & offers</Label>
              <Switch 
                checked={settings.promotions} 
                onCheckedChange={() => handleToggle('promotions')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal">Newsletter</Label>
              <Switch 
                checked={settings.newsletter} 
                onCheckedChange={() => handleToggle('newsletter')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-normal">New services</Label>
              <Switch 
                checked={settings.newServices} 
                onCheckedChange={() => handleToggle('newServices')} 
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
