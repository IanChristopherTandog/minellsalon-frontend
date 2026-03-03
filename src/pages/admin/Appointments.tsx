import React, { useEffect, useState } from 'react';
import { appointmentService } from '@/services/api';
import { AppointmentWithDetails } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime } from '@/utils/dateTime';
import { useToast } from '@/hooks/use-toast';
import { SearchFilter } from '@/components/SearchFilter';
import { ViewDetailsModal } from '@/components/modals';

const Appointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentWithDetails[]>([]);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    appointment: AppointmentWithDetails | null;
  }>({ open: false, appointment: null });

  useEffect(() => {
    appointmentService.getAllWithDetails().then(setAppointments);
  }, []);

  useEffect(() => {
    let filtered = [...appointments];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(apt =>
        apt.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, statusFilter]);

  const handleConfirm = async (id: string) => {
    await appointmentService.updateStatus(id, 'Confirmed');
    setAppointments(prev => prev.map(a => a.id === id ? {...a, status: 'Confirmed'} : a));
    toast({ title: 'Appointment confirmed' });
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, any> = { Pending: 'pending', Confirmed: 'confirmed', Completed: 'completed', Cancelled: 'cancelled' };
    return map[status] || 'default';
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-semibold">Appointments</h1>
      
      {/* Search and Filter */}
      <SearchFilter
        searchPlaceholder="Search by client, service, or email..."
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

      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAppointments.map(apt => (
                <tr key={apt.id}>
                  <td className="px-4 py-3">{apt.user?.name}</td>
                  <td className="px-4 py-3">{apt.service?.name}</td>
                  <td className="px-4 py-3">{formatDate(apt.date)}</td>
                  <td className="px-4 py-3">{formatTime(apt.startTime)}</td>
                  <td className="px-4 py-3"><Badge variant={getStatusVariant(apt.status)}>{apt.status}</Badge></td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewModal({ open: true, appointment: apt })}
                    >
                      View
                    </Button>
                    {apt.status === 'Pending' && (
                      <Button size="sm" onClick={() => handleConfirm(apt.id)}>Confirm</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewModal.appointment && (
        <ViewDetailsModal
          open={viewModal.open}
          onOpenChange={(open) => setViewModal({ open, appointment: open ? viewModal.appointment : null })}
          title="Appointment Details"
          data={[
            { label: 'Client', value: viewModal.appointment.user?.name || '' },
            { label: 'Email', value: viewModal.appointment.user?.email || '' },
            { label: 'Service', value: viewModal.appointment.service?.name || '' },
            { label: 'Date', value: formatDate(viewModal.appointment.date) },
            { label: 'Time', value: formatTime(viewModal.appointment.startTime) },
            { label: 'Staff', value: viewModal.appointment.staff?.name || 'Not assigned' },
            { label: 'Status', value: viewModal.appointment.status },
            { label: 'Notes', value: viewModal.appointment.notes || 'No notes' },
          ]}
        />
      )}
    </div>
  );
};

export default Appointments;
