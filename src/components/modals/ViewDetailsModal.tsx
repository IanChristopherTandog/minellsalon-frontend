import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Mail, Phone } from 'lucide-react';

interface ViewDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: Record<string, any>;
  type?: 'appointment' | 'user' | 'inquiry' | 'generic';
}

export const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  open,
  onOpenChange,
  title,
  data,
  type = 'generic',
}) => {
  const renderAppointmentDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <Calendar className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Date</p>
          <p className="font-medium">{data.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <Clock className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Time</p>
          <p className="font-medium">{data.startTime} - {data.endTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <User className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Service</p>
          <p className="font-medium">{data.service}</p>
        </div>
      </div>
      {data.status && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={data.status.toLowerCase()}>{data.status}</Badge>
        </div>
      )}
      {data.notes && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Notes</p>
          <p className="text-sm">{data.notes}</p>
        </div>
      )}
    </div>
  );

  const renderUserDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <User className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{data.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <Mail className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{data.email}</p>
        </div>
      </div>
      {data.phone && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{data.phone}</p>
          </div>
        </div>
      )}
      {data.role && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Role:</span>
          <Badge>{data.role}</Badge>
        </div>
      )}
    </div>
  );

  const renderGenericDetails = () => (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center p-2 border-b last:border-0">
          <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
          <span className="font-medium text-sm">{String(value)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            View detailed information below.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {type === 'appointment' && renderAppointmentDetails()}
          {type === 'user' && renderUserDetails()}
          {type === 'generic' && renderGenericDetails()}
          {type === 'inquiry' && renderGenericDetails()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
