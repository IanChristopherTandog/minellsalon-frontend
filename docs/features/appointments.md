# Appointments Feature

This document covers the appointment booking and management system.

## 📋 User Stories

### Client Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Client | Book an appointment online | I don't have to call the salon |
| Client | Select my preferred staff member | I get the stylist I trust |
| Client | See available time slots | I can plan my visit |
| Client | Reschedule my appointment | I can adjust if plans change |
| Client | Cancel an appointment | I don't waste the salon's time |
| Client | See my appointment history | I can track my visits |

### Admin Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Admin | View all appointments | I can manage the schedule |
| Admin | Filter by date/status/staff | I can find specific bookings |
| Admin | Update appointment status | I can track progress |
| Admin | See today's schedule | I can prepare for the day |

---

## 🔄 Booking Flow

### 4-Step Wizard

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Step 1  │ → │ Step 2  │ → │ Step 3  │ → │ Step 4  │
│ Service │   │  Staff  │   │  Time   │   │ Confirm │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
```

#### Step 1: Service Selection
- Browse by category (Hair, Nail, Lashes)
- See price and duration
- One service per booking

#### Step 2: Staff Selection (Optional)
- Filter by service specialty
- View staff profiles
- "Any available" option

#### Step 3: Date & Time
- Calendar for date selection
- Available time slots shown
- Blocked times hidden

#### Step 4: Confirmation
- Review all details
- Add notes (optional)
- Requires authentication

---

## 📊 Data Model

### Appointment

```typescript
interface Appointment {
  id: string;
  userId: string;           // Who booked
  serviceId: string;        // What service
  staffId?: string;         // Assigned staff (optional)
  date: string;             // YYYY-MM-DD
  startTime: string;        // HH:MM
  endTime: string;          // HH:MM (calculated from duration)
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  pointsEarned?: number;    // Loyalty points when completed
}

type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
```

### AppointmentWithDetails

Extended type with related data:

```typescript
interface AppointmentWithDetails extends Appointment {
  user?: User;      // Client info
  service?: Service; // Service details
  staff?: Staff;     // Staff info
}
```

---

## ✅ Validation Rules

### Booking Constraints

| Rule | Description |
|------|-------------|
| Future dates only | Cannot book in the past |
| Business hours | 9 AM - 6 PM (configurable) |
| No double booking | Staff can't have overlapping appointments |
| Blocked times | Respects availability blocks |
| Duration fit | End time must be within business hours |

### Status Transitions

```
Pending → Confirmed → Completed
    ↓         ↓
Cancelled  Cancelled
```

---

## ⚠️ Edge Cases

### Handled

1. **Staff unavailable**: Show "No available slots" message
2. **All slots booked**: Disable date in calendar
3. **Login required**: Redirect to login, return to booking after
4. **Service inactive**: Don't show in selector

### TODO / Not Handled

1. **Recurring appointments**: Not supported
2. **Multiple services per booking**: Not supported
3. **Deposit/payment at booking**: Not implemented
4. **Waitlist for full days**: Not implemented

---

## 📁 Related Code

### Pages

| File | Purpose |
|------|---------|
| `src/pages/BookAppointment.tsx` | Booking wizard |
| `src/pages/admin/Appointments.tsx` | Admin appointment list |
| `src/pages/client/Appointments.tsx` | Client appointment list |

### Components

| File | Purpose |
|------|---------|
| `src/components/modals/RescheduleModal.tsx` | Reschedule dialog |
| `src/components/modals/CancelAppointmentModal.tsx` | Cancel confirmation |
| `src/components/modals/ViewDetailsModal.tsx` | Appointment details |

### Services

```typescript
// src/services/api.ts

appointmentService.getAll()
appointmentService.getAllWithDetails()
appointmentService.getByUser(userId)
appointmentService.getByDate(date)
appointmentService.create(appointment)
appointmentService.updateStatus(id, status)
appointmentService.reschedule(id, date, startTime, endTime)
appointmentService.cancel(id)
```

---

## 🎨 UI States

### Booking Page States

| State | Display |
|-------|---------|
| Loading services | Skeleton cards |
| No services | "No services available" |
| Slot loading | Spinner in time grid |
| No available slots | Message + suggest different date |
| Submitting | Button disabled + spinner |
| Success | Toast + redirect to appointments |

### Appointment Card States

| Status | Badge Color | Actions Available |
|--------|-------------|-------------------|
| Pending | Yellow | Reschedule, Cancel |
| Confirmed | Green | Reschedule, Cancel |
| Completed | Blue | View Only |
| Cancelled | Red | View Only |
