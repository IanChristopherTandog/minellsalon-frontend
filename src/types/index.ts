// User Types
export type UserRole = 'CLIENT' | 'ADMIN';
export type UserStatus = 'active' | 'disabled';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
  status: UserStatus;
  loyaltyPoints?: number;
}

// Service Types
export type ServiceCategory = 'Hair' | 'Nail' | 'Lashes';

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  mediaUrls: string[];
  pointsEarned?: number;
}

// Staff Types
export interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialties: ServiceCategory[];
  avatarUrl?: string;
  isActive: boolean;
  commissionRate?: number;
  hireDate?: string;
  bio?: string;
}

// Staff Availability
export interface StaffAvailability {
  id: string;
  staffId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// Commission Types
export interface Commission {
  id: string;
  staffId: string;
  appointmentId: string;
  serviceAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'paid';
  createdAt: string;
  paidAt?: string;
}

// Loyalty Types
export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  expiryDays?: number;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  appointmentId?: string;
  rewardId?: string;
  createdAt: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  redeemedAt: string;
  expiresAt?: string;
  usedAt?: string;
  isUsed: boolean;
}

// Notification Template Types
export type NotificationChannel = 'email' | 'sms';
export type NotificationTrigger = 
  | 'appointment_confirmed'
  | 'appointment_reminder_24h'
  | 'appointment_reminder_1h'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'loyalty_points_earned'
  | 'loyalty_reward_available';

export interface NotificationTemplate {
  id: string;
  trigger: NotificationTrigger;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  isActive: boolean;
  variables: string[];
}

export interface NotificationLog {
  id: string;
  userId: string;
  templateId: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  createdAt: string;
}

// In-App Notification Types
export type InAppNotificationType = 
  | 'appointment_new'
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'inquiry_new'
  | 'inquiry_reply'
  | 'user_registered'
  | 'loyalty_earned'
  | 'loyalty_redeemed'
  | 'system';

export interface InAppNotification {
  id: string;
  userId: string;
  type: InAppNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Appointment Types
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  staffId?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  pointsEarned?: number;
}

export interface AppointmentWithDetails extends Appointment {
  user?: User;
  service?: Service;
  staff?: Staff;
}

// Inquiry Types
export type InquiryTopic = 'Services' | 'Promos' | 'Availability' | 'Other';
export type InquiryStatus = 'Open' | 'Resolved';

export interface InquiryMessage {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  userId?: string;
  name: string;
  email: string;
  topic: InquiryTopic;
  status: InquiryStatus;
  messages: InquiryMessage[];
  createdAt: string;
}

// Promo Types
export interface Promo {
  id: string;
  title: string;
  details: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerUrl: string;
  discountPercent?: number;
}

// Availability Types
export type AvailabilityAppliesTo = 'All' | 'Service' | 'Staff';

export interface AvailabilityBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  appliesTo: AvailabilityAppliesTo;
  appliesToId?: string;
  createdAt: string;
}

// Media Types
export type MediaType = 'image' | 'video';

export interface MediaFile {
  id: string;
  url: string;
  type: MediaType;
  caption?: string;
  category: ServiceCategory | 'General';
  createdAt: string;
}

// Gallery/Hairstyle Types
export interface HairstyleInspiration {
  id: string;
  name: string;
  imageUrl: string;
  length: 'Short' | 'Medium' | 'Long';
  color: string;
  style: string;
  relatedServiceIds: string[];
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
  date: string;
}

// Time Slot Types
export interface TimeSlot {
  time: string;
  available: boolean;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Report Types
export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  revenue: number;
}

export interface StaffStats {
  staffId: string;
  staffName: string;
  appointmentCount: number;
  completionRate: number;
}

export interface CommissionSummary {
  staffId: string;
  staffName: string;
  totalAppointments: number;
  totalServiceAmount: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
}

// Site Content Types (Admin Editable)
export interface SiteContent {
  id: string;
  key: string;
  section: 'header' | 'footer' | 'contact' | 'about' | 'navigation' | 'general';
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'list' | 'boolean';
  updatedAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  isVisible: boolean;
  order: number;
}
