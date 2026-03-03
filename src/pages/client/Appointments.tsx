import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentService } from '@/services/api';
import { AppointmentWithDetails } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime } from '@/utils/dateTime';
import { Calendar, Clock, RefreshCw, X } from 'lucide-react';
import { RescheduleModal } from '@/components/modals/RescheduleModal';
import { CancelAppointmentModal } from '@/components/modals/CancelAppointmentModal';
import { SearchFilter } from '@/components/SearchFilter';
import { useToast } from '@/hooks/use-toast';

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentWithDetails[]>([]);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [rescheduleModal, setRescheduleModal] = useState<{
    open: boolean;
    appointment: AppointmentWithDetails | null;
  }>({ open: false, appointment: null });

  const [cancelModal, setCancelModal] = useState<{
    open: boolean;
    appointment: AppointmentWithDetails | null;
  }>({ open: false, appointment: null });

  useEffect(() => {
    if (user) {
      appointmentService.getByUser(user.id).then(setAppointments);
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...appointments];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(apt =>
        apt.service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.staff?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, statusFilter]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Confirmed': return 'confirmed';
      case 'Completed': return 'completed';
      case 'Cancelled': return 'cancelled';
      default: return 'default';
    }
  };

  const handleReschedule = (id: string, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id ? { ...apt, date: newDate, startTime: newTime } : apt
    ));
  };

  const handleCancel = (id: string, reason: string) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === id ? { ...apt, status: 'Cancelled' } : apt
    ));
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">My Appointments</h1>
        <p className="text-muted-foreground">View and manage your bookings</p>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchPlaceholder="Search appointments..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            name: 'status',
            label: 'Status',
            options: [
              { value: 'Pending', label: 'Pending' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="card-luxury p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {appointments.length === 0 ? 'No appointments yet' : 'No appointments match your filters'}
            </p>
            {appointments.length === 0 && (
              <Button asChild><a href="/book">Book Now</a></Button>
            )}
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div key={apt.id} className="card-luxury p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{apt.service?.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(apt.date)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatTime(apt.startTime)}</span>
                  </div>
                  {apt.staff && <p className="text-sm text-muted-foreground mt-1">with {apt.staff.name}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(apt.status) as any}>{apt.status}</Badge>
                  {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRescheduleModal({ open: true, appointment: apt })}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelModal({ open: true, appointment: apt })}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal.appointment && (
        <RescheduleModal
          open={rescheduleModal.open}
          onOpenChange={(open) => setRescheduleModal({ open, appointment: open ? rescheduleModal.appointment : null })}
          appointmentId={rescheduleModal.appointment.id}
          currentDate={rescheduleModal.appointment.date}
          currentTime={rescheduleModal.appointment.startTime}
          onReschedule={handleReschedule}
        />
      )}

      {/* Cancel Modal */}
      {cancelModal.appointment && (
        <CancelAppointmentModal
          open={cancelModal.open}
          onOpenChange={(open) => setCancelModal({ open, appointment: open ? cancelModal.appointment : null })}
          appointmentId={cancelModal.appointment.id}
          serviceName={cancelModal.appointment.service?.name || 'Appointment'}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
};

export default Appointments;
