import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockServices, mockStaff } from '@/data/mockData';
import { slotService, appointmentService } from '@/services/api';
import { Service, Staff, TimeSlot, ServiceCategory } from '@/types';
import { formatPrice, formatDuration, formatTime, calculateEndTime } from '@/utils/dateTime';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';

const categories: ServiceCategory[] = ['Hair', 'Nail', 'Lashes'];

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = selectedCategory ? mockServices.filter(s => s.category === selectedCategory && s.isActive) : [];
  const availableStaff = selectedService ? mockStaff.filter(s => s.isActive && s.specialties.includes(selectedService.category)) : [];

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const service = mockServices.find(s => s.id === serviceId);
      if (service) {
        setSelectedCategory(service.category);
        setSelectedService(service);
        setStep(2);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      slotService.getAvailableSlots(
        format(selectedDate, 'yyyy-MM-dd'),
        selectedService.id,
        selectedStaff?.id
      ).then(setSlots);
    }
  }, [selectedDate, selectedService, selectedStaff]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Please login', description: 'You need to login to book an appointment.', variant: 'destructive' });
      navigate('/login');
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime || !user) return;

    setIsSubmitting(true);
    try {
      await appointmentService.create({
        userId: user.id,
        serviceId: selectedService.id,
        staffId: selectedStaff?.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedTime,
        endTime: calculateEndTime(selectedTime, selectedService.durationMinutes),
        status: 'Pending',
        notes: notes || undefined,
      });

      toast({ title: 'Appointment Booked!', description: 'We\'ll confirm your appointment shortly.' });
      navigate('/client/appointments');
    } catch {
      toast({ title: 'Error', description: 'Failed to book. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedService;
      case 2: return true;
      case 3: return !!selectedDate && !!selectedTime;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-semibold text-foreground mb-2">Book Appointment</h1>
            <p className="text-muted-foreground">Step {step} of 4</p>
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={cn('h-2 w-16 rounded-full', s <= step ? 'bg-primary' : 'bg-muted')} />
            ))}
          </div>

          <div className="card-luxury p-6 md:p-8">
            {/* Step 1: Service */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-semibold">Choose a Service</h2>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <Button key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} onClick={() => { setSelectedCategory(cat); setSelectedService(null); }}>
                      {cat}
                    </Button>
                  ))}
                </div>
                {selectedCategory && (
                  <div className="grid gap-3">
                    {services.map(s => (
                      <div key={s.id} onClick={() => setSelectedService(s)} className={cn('p-4 rounded-xl border cursor-pointer transition-all', selectedService?.id === s.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{s.name}</h4>
                            <p className="text-sm text-muted-foreground">{formatDuration(s.durationMinutes)}</p>
                          </div>
                          <span className="font-semibold">{formatPrice(s.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Staff */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-semibold">Choose a Stylist (Optional)</h2>
                <div className="grid gap-3">
                  <div onClick={() => setSelectedStaff(null)} className={cn('p-4 rounded-xl border cursor-pointer', !selectedStaff ? 'border-primary bg-primary/5' : 'border-border')}>
                    <p className="font-medium">Any Available Stylist</p>
                  </div>
                  {availableStaff.map(s => (
                    <div key={s.id} onClick={() => setSelectedStaff(s)} className={cn('p-4 rounded-xl border cursor-pointer flex items-center gap-4', selectedStaff?.id === s.id ? 'border-primary bg-primary/5' : 'border-border')}>
                      <img src={s.avatarUrl} alt={s.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.specialties.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date/Time */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-semibold">Select Date & Time</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={date => date < new Date()} className="rounded-xl border p-3 pointer-events-auto" />
                  <div>
                    <h3 className="font-medium mb-3">Available Times</h3>
                    {selectedDate ? (
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {slots.filter(s => s.available).map(slot => (
                          <Button key={slot.time} size="sm" variant={selectedTime === slot.time ? 'default' : 'outline'} onClick={() => setSelectedTime(slot.time)}>
                            {formatTime(slot.time)}
                          </Button>
                        ))}
                        {slots.filter(s => s.available).length === 0 && <p className="col-span-3 text-muted-foreground text-sm">No slots available</p>}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Select a date first</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-semibold">Confirm Booking</h2>
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{selectedService?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Stylist</span><span className="font-medium">{selectedStaff?.name || 'Any Available'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate && format(selectedDate, 'MMMM d, yyyy')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedTime && formatTime(selectedTime)}</span></div>
                  <div className="flex justify-between border-t pt-3"><span className="font-medium">Total</span><span className="font-semibold text-lg">{formatPrice(selectedService?.price || 0)}</span></div>
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requests?" />
                </div>
                {!isAuthenticated && <p className="text-sm text-destructive">Please login to complete your booking.</p>}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < 4 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting || !isAuthenticated}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Confirm Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
