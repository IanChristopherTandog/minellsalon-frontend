import {
  User,
  Service,
  Staff,
  Appointment,
  AppointmentWithDetails,
  Inquiry,
  InquiryMessage,
  Promo,
  AvailabilityBlock,
  MediaFile,
  HairstyleInspiration,
  Testimonial,
  TimeSlot,
  ServiceCategory,
  AppointmentStatus,
  InquiryStatus,
  LoyaltyReward,
  LoyaltyTransaction,
  UserReward,
  Commission,
  CommissionSummary,
  StaffAvailability,
  NotificationTemplate,
  NotificationLog,
  SiteContent,
  NavigationItem,
} from '@/types';
import {
  mockUsers,
  mockServices,
  mockStaff,
  mockAppointments,
  mockInquiries,
  mockPromos,
  mockAvailabilityBlocks,
  mockMediaFiles,
  mockHairstyleInspirations,
  mockTestimonials,
  mockLoyaltyRewards,
  mockLoyaltyTransactions,
  mockUserRewards,
  mockCommissions,
  mockStaffAvailability,
  mockNotificationTemplates,
  mockNotificationLogs,
  mockSiteContent,
  mockNavigationItems,
} from '@/data/mockData';

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// ==================== USER SERVICES ====================
export const userService = {
  async getAll(): Promise<User[]> {
    await delay();
    return [...mockUsers];
  },

  async getById(id: string): Promise<User | undefined> {
    await delay();
    return mockUsers.find(u => u.id === id);
  },

  async getByEmail(email: string): Promise<User | undefined> {
    await delay();
    return mockUsers.find(u => u.email === email);
  },

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await delay();
    const newUser: User = {
      ...user,
      id: `user-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<User | undefined> {
    await delay();
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...updates };
      return mockUsers[index];
    }
    return undefined;
  },

  async toggleStatus(id: string): Promise<User | undefined> {
    await delay();
    const user = mockUsers.find(u => u.id === id);
    if (user) {
      user.status = user.status === 'active' ? 'disabled' : 'active';
      return user;
    }
    return undefined;
  },
};

// ==================== SERVICE SERVICES ====================
export const serviceService = {
  async getAll(): Promise<Service[]> {
    await delay();
    return [...mockServices];
  },

  async getActive(): Promise<Service[]> {
    await delay();
    return mockServices.filter(s => s.isActive);
  },

  async getByCategory(category: ServiceCategory): Promise<Service[]> {
    await delay();
    return mockServices.filter(s => s.category === category && s.isActive);
  },

  async getById(id: string): Promise<Service | undefined> {
    await delay();
    return mockServices.find(s => s.id === id);
  },

  async create(service: Omit<Service, 'id'>): Promise<Service> {
    await delay();
    const newService: Service = {
      ...service,
      id: `service-${generateId()}`,
    };
    mockServices.push(newService);
    return newService;
  },

  async update(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    await delay();
    const index = mockServices.findIndex(s => s.id === id);
    if (index !== -1) {
      mockServices[index] = { ...mockServices[index], ...updates };
      return mockServices[index];
    }
    return undefined;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const index = mockServices.findIndex(s => s.id === id);
    if (index !== -1) {
      mockServices.splice(index, 1);
      return true;
    }
    return false;
  },
};

// ==================== STAFF SERVICES ====================
export const staffService = {
  async getAll(): Promise<Staff[]> {
    await delay();
    return [...mockStaff];
  },

  async getActive(): Promise<Staff[]> {
    await delay();
    return mockStaff.filter(s => s.isActive);
  },

  async getBySpecialty(category: ServiceCategory): Promise<Staff[]> {
    await delay();
    return mockStaff.filter(s => s.isActive && s.specialties.includes(category));
  },

  async getById(id: string): Promise<Staff | undefined> {
    await delay();
    return mockStaff.find(s => s.id === id);
  },

  async create(staff: Omit<Staff, 'id'>): Promise<Staff> {
    await delay();
    const newStaff: Staff = {
      ...staff,
      id: `staff-${generateId()}`,
    };
    mockStaff.push(newStaff);
    return newStaff;
  },

  async update(id: string, updates: Partial<Staff>): Promise<Staff | undefined> {
    await delay();
    const index = mockStaff.findIndex(s => s.id === id);
    if (index !== -1) {
      mockStaff[index] = { ...mockStaff[index], ...updates };
      return mockStaff[index];
    }
    return undefined;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const index = mockStaff.findIndex(s => s.id === id);
    if (index !== -1) {
      mockStaff.splice(index, 1);
      return true;
    }
    return false;
  },

  async toggleActive(id: string): Promise<Staff | undefined> {
    await delay();
    const staff = mockStaff.find(s => s.id === id);
    if (staff) {
      staff.isActive = !staff.isActive;
      return staff;
    }
    return undefined;
  },
};

// ==================== STAFF AVAILABILITY SERVICES ====================
export const staffAvailabilityService = {
  async getByStaff(staffId: string): Promise<StaffAvailability[]> {
    await delay();
    return mockStaffAvailability.filter(a => a.staffId === staffId);
  },

  async update(id: string, updates: Partial<StaffAvailability>): Promise<StaffAvailability | undefined> {
    await delay();
    const index = mockStaffAvailability.findIndex(a => a.id === id);
    if (index !== -1) {
      mockStaffAvailability[index] = { ...mockStaffAvailability[index], ...updates };
      return mockStaffAvailability[index];
    }
    return undefined;
  },

  async create(availability: Omit<StaffAvailability, 'id'>): Promise<StaffAvailability> {
    await delay();
    const newAvail: StaffAvailability = {
      ...availability,
      id: `avail-${generateId()}`,
    };
    mockStaffAvailability.push(newAvail);
    return newAvail;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const index = mockStaffAvailability.findIndex(a => a.id === id);
    if (index !== -1) {
      mockStaffAvailability.splice(index, 1);
      return true;
    }
    return false;
  },
};

// ==================== APPOINTMENT SERVICES ====================
export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    await delay();
    return [...mockAppointments];
  },

  async getAllWithDetails(): Promise<AppointmentWithDetails[]> {
    await delay();
    return mockAppointments.map(apt => ({
      ...apt,
      user: mockUsers.find(u => u.id === apt.userId),
      service: mockServices.find(s => s.id === apt.serviceId),
      staff: mockStaff.find(s => s.id === apt.staffId),
    }));
  },

  async getByUser(userId: string): Promise<AppointmentWithDetails[]> {
    await delay();
    return mockAppointments
      .filter(apt => apt.userId === userId)
      .map(apt => ({
        ...apt,
        service: mockServices.find(s => s.id === apt.serviceId),
        staff: mockStaff.find(s => s.id === apt.staffId),
      }));
  },

  async getByDate(date: string): Promise<AppointmentWithDetails[]> {
    await delay();
    return mockAppointments
      .filter(apt => apt.date === date)
      .map(apt => ({
        ...apt,
        user: mockUsers.find(u => u.id === apt.userId),
        service: mockServices.find(s => s.id === apt.serviceId),
        staff: mockStaff.find(s => s.id === apt.staffId),
      }));
  },

  async getById(id: string): Promise<AppointmentWithDetails | undefined> {
    await delay();
    const apt = mockAppointments.find(a => a.id === id);
    if (!apt) return undefined;
    return {
      ...apt,
      user: mockUsers.find(u => u.id === apt.userId),
      service: mockServices.find(s => s.id === apt.serviceId),
      staff: mockStaff.find(s => s.id === apt.staffId),
    };
  },

  async create(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    await delay();
    const newApt: Appointment = {
      ...appointment,
      id: `apt-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    mockAppointments.push(newApt);
    return newApt;
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment | undefined> {
    await delay();
    const apt = mockAppointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      return apt;
    }
    return undefined;
  },

  async reschedule(id: string, date: string, startTime: string, endTime: string): Promise<Appointment | undefined> {
    await delay();
    const apt = mockAppointments.find(a => a.id === id);
    if (apt) {
      apt.date = date;
      apt.startTime = startTime;
      apt.endTime = endTime;
      return apt;
    }
    return undefined;
  },

  async cancel(id: string): Promise<Appointment | undefined> {
    return this.updateStatus(id, 'Cancelled');
  },
};

// ==================== INQUIRY SERVICES ====================
export const inquiryService = {
  async getAll(): Promise<Inquiry[]> {
    await delay();
    return [...mockInquiries];
  },

  async getOpen(): Promise<Inquiry[]> {
    await delay();
    return mockInquiries.filter(i => i.status === 'Open');
  },

  async getById(id: string): Promise<Inquiry | undefined> {
    await delay();
    return mockInquiries.find(i => i.id === id);
  },

  async create(inquiry: Omit<Inquiry, 'id' | 'status' | 'messages' | 'createdAt'> & { message: string }): Promise<Inquiry> {
    await delay();
    const newInquiry: Inquiry = {
      id: `inq-${generateId()}`,
      userId: inquiry.userId,
      name: inquiry.name,
      email: inquiry.email,
      topic: inquiry.topic,
      status: 'Open',
      messages: [
        {
          id: `msg-${generateId()}`,
          content: inquiry.message,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    mockInquiries.push(newInquiry);
    return newInquiry;
  },

  async addMessage(inquiryId: string, content: string, isAdmin: boolean): Promise<Inquiry | undefined> {
    await delay();
    const inquiry = mockInquiries.find(i => i.id === inquiryId);
    if (inquiry) {
      const message: InquiryMessage = {
        id: `msg-${generateId()}`,
        content,
        isAdmin,
        createdAt: new Date().toISOString(),
      };
      inquiry.messages.push(message);
      return inquiry;
    }
    return undefined;
  },

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry | undefined> {
    await delay();
    const inquiry = mockInquiries.find(i => i.id === id);
    if (inquiry) {
      inquiry.status = status;
      return inquiry;
    }
    return undefined;
  },

  async resolve(id: string): Promise<Inquiry | undefined> {
    return this.updateStatus(id, 'Resolved');
  },
};

// ==================== PROMO SERVICES ====================
export const promoService = {
  async getAll(): Promise<Promo[]> {
    await delay();
    return [...mockPromos];
  },

  async getActive(): Promise<Promo[]> {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    return mockPromos.filter(p => p.isActive && p.startDate <= today && p.endDate >= today);
  },

  async getById(id: string): Promise<Promo | undefined> {
    await delay();
    return mockPromos.find(p => p.id === id);
  },

  async create(promo: Omit<Promo, 'id'>): Promise<Promo> {
    await delay();
    const newPromo: Promo = {
      ...promo,
      id: `promo-${generateId()}`,
    };
    mockPromos.push(newPromo);
    return newPromo;
  },

  async update(id: string, updates: Partial<Promo>): Promise<Promo | undefined> {
    await delay();
    const index = mockPromos.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPromos[index] = { ...mockPromos[index], ...updates };
      return mockPromos[index];
    }
    return undefined;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const index = mockPromos.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPromos.splice(index, 1);
      return true;
    }
    return false;
  },
};

// ==================== AVAILABILITY SERVICES ====================
export const availabilityService = {
  async getAll(): Promise<AvailabilityBlock[]> {
    await delay();
    return [...mockAvailabilityBlocks];
  },

  async getByDate(date: string): Promise<AvailabilityBlock[]> {
    await delay();
    return mockAvailabilityBlocks.filter(b => b.date === date);
  },

  async getUpcoming(): Promise<AvailabilityBlock[]> {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    return mockAvailabilityBlocks.filter(b => b.date >= today);
  },

  async create(block: Omit<AvailabilityBlock, 'id' | 'createdAt'>): Promise<AvailabilityBlock> {
    await delay();
    const newBlock: AvailabilityBlock = {
      ...block,
      id: `block-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    mockAvailabilityBlocks.push(newBlock);
    return newBlock;
  },

  async update(id: string, updates: Partial<AvailabilityBlock>): Promise<AvailabilityBlock | undefined> {
    await delay();
    const index = mockAvailabilityBlocks.findIndex(b => b.id === id);
    if (index !== -1) {
      mockAvailabilityBlocks[index] = { ...mockAvailabilityBlocks[index], ...updates };
      return mockAvailabilityBlocks[index];
    }
    return undefined;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const index = mockAvailabilityBlocks.findIndex(b => b.id === id);
    if (index !== -1) {
      mockAvailabilityBlocks.splice(index, 1);
      return true;
    }
    return false;
  },
};

// ==================== MEDIA SERVICES ====================
export const mediaService = {
  async getAll(): Promise<MediaFile[]> {
    await delay();
    return [...mockMediaFiles];
  },

  async getByCategory(category: ServiceCategory | 'General'): Promise<MediaFile[]> {
    await delay();
    return mockMediaFiles.filter(m => m.category === category);
  },

  async create(media: Omit<MediaFile, 'id' | 'createdAt'>): Promise<MediaFile> {
    await delay();
    const newMedia: MediaFile = {
      ...media,
      id: `media-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    mockMediaFiles.push(newMedia);
    return newMedia;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const index = mockMediaFiles.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMediaFiles.splice(index, 1);
      return true;
    }
    return false;
  },
};

// ==================== HAIRSTYLE SERVICES ====================
export const hairstyleService = {
  async getAll(): Promise<HairstyleInspiration[]> {
    await delay();
    return [...mockHairstyleInspirations];
  },

  async getFiltered(filters: { length?: string; color?: string; style?: string }): Promise<HairstyleInspiration[]> {
    await delay();
    return mockHairstyleInspirations.filter(h => {
      if (filters.length && h.length !== filters.length) return false;
      if (filters.color && h.color !== filters.color) return false;
      if (filters.style && h.style !== filters.style) return false;
      return true;
    });
  },

  async getById(id: string): Promise<HairstyleInspiration | undefined> {
    await delay();
    return mockHairstyleInspirations.find(h => h.id === id);
  },
};

// ==================== TESTIMONIAL SERVICES ====================
export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    await delay();
    return [...mockTestimonials];
  },
};

// ==================== LOYALTY SERVICES ====================
export const loyaltyService = {
  async getRewards(): Promise<LoyaltyReward[]> {
    await delay();
    return mockLoyaltyRewards.filter(r => r.isActive);
  },

  async getAllRewards(): Promise<LoyaltyReward[]> {
    await delay();
    return [...mockLoyaltyRewards];
  },

  async getRewardById(id: string): Promise<LoyaltyReward | undefined> {
    await delay();
    return mockLoyaltyRewards.find(r => r.id === id);
  },

  async createReward(reward: Omit<LoyaltyReward, 'id'>): Promise<LoyaltyReward> {
    await delay();
    const newReward: LoyaltyReward = {
      ...reward,
      id: `reward-${generateId()}`,
    };
    mockLoyaltyRewards.push(newReward);
    return newReward;
  },

  async updateReward(id: string, updates: Partial<LoyaltyReward>): Promise<LoyaltyReward | undefined> {
    await delay();
    const index = mockLoyaltyRewards.findIndex(r => r.id === id);
    if (index !== -1) {
      mockLoyaltyRewards[index] = { ...mockLoyaltyRewards[index], ...updates };
      return mockLoyaltyRewards[index];
    }
    return undefined;
  },

  async deleteReward(id: string): Promise<boolean> {
    await delay();
    const index = mockLoyaltyRewards.findIndex(r => r.id === id);
    if (index !== -1) {
      mockLoyaltyRewards.splice(index, 1);
      return true;
    }
    return false;
  },

  async getAllTransactions(): Promise<LoyaltyTransaction[]> {
    await delay();
    return [...mockLoyaltyTransactions];
  },

  async getUserTransactions(userId: string): Promise<LoyaltyTransaction[]> {
    await delay();
    return mockLoyaltyTransactions.filter(t => t.userId === userId);
  },

  async getUserRewards(userId: string): Promise<(UserReward & { reward: LoyaltyReward })[]> {
    await delay();
    return mockUserRewards
      .filter(ur => ur.userId === userId)
      .map(ur => ({
        ...ur,
        reward: mockLoyaltyRewards.find(r => r.id === ur.rewardId)!,
      }))
      .filter(ur => ur.reward);
  },

  async redeemReward(userId: string, rewardId: string): Promise<UserReward | undefined> {
    await delay();
    const user = mockUsers.find(u => u.id === userId);
    const reward = mockLoyaltyRewards.find(r => r.id === rewardId);
    
    if (!user || !reward || (user.loyaltyPoints || 0) < reward.pointsCost) {
      return undefined;
    }

    // Deduct points
    user.loyaltyPoints = (user.loyaltyPoints || 0) - reward.pointsCost;

    // Create transaction
    const transaction: LoyaltyTransaction = {
      id: `lt-${generateId()}`,
      userId,
      type: 'redeemed',
      points: -reward.pointsCost,
      description: `Redeemed: ${reward.name}`,
      rewardId,
      createdAt: new Date().toISOString(),
    };
    mockLoyaltyTransactions.push(transaction);

    // Create user reward
    const expiresAt = reward.expiryDays
      ? new Date(Date.now() + reward.expiryDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const userReward: UserReward = {
      id: `ur-${generateId()}`,
      userId,
      rewardId,
      redeemedAt: new Date().toISOString(),
      expiresAt,
      isUsed: false,
    };
    mockUserRewards.push(userReward);

    return userReward;
  },

  async addPoints(userId: string, points: number, description: string, appointmentId?: string): Promise<LoyaltyTransaction> {
    await delay();
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
    }

    const transaction: LoyaltyTransaction = {
      id: `lt-${generateId()}`,
      userId,
      type: 'earned',
      points,
      description,
      appointmentId,
      createdAt: new Date().toISOString(),
    };
    mockLoyaltyTransactions.push(transaction);

    return transaction;
  },
};

// ==================== COMMISSION SERVICES ====================
export const commissionService = {
  async getAll(): Promise<Commission[]> {
    await delay();
    return [...mockCommissions];
  },

  async getByStaff(staffId: string): Promise<Commission[]> {
    await delay();
    return mockCommissions.filter(c => c.staffId === staffId);
  },

  async getSummary(): Promise<CommissionSummary[]> {
    await delay();
    const summaryMap = new Map<string, CommissionSummary>();

    for (const staff of mockStaff) {
      summaryMap.set(staff.id, {
        staffId: staff.id,
        staffName: staff.name,
        totalAppointments: 0,
        totalServiceAmount: 0,
        totalCommission: 0,
        pendingCommission: 0,
        paidCommission: 0,
      });
    }

    for (const commission of mockCommissions) {
      const summary = summaryMap.get(commission.staffId);
      if (summary) {
        summary.totalAppointments++;
        summary.totalServiceAmount += commission.serviceAmount;
        summary.totalCommission += commission.commissionAmount;
        if (commission.status === 'pending') {
          summary.pendingCommission += commission.commissionAmount;
        } else {
          summary.paidCommission += commission.commissionAmount;
        }
      }
    }

    return Array.from(summaryMap.values());
  },

  async markAsPaid(id: string): Promise<Commission | undefined> {
    await delay();
    const commission = mockCommissions.find(c => c.id === id);
    if (commission) {
      commission.status = 'paid';
      commission.paidAt = new Date().toISOString();
      return commission;
    }
    return undefined;
  },

  async markMultipleAsPaid(ids: string[]): Promise<Commission[]> {
    await delay();
    const updated: Commission[] = [];
    for (const id of ids) {
      const commission = mockCommissions.find(c => c.id === id);
      if (commission) {
        commission.status = 'paid';
        commission.paidAt = new Date().toISOString();
        updated.push(commission);
      }
    }
    return updated;
  },

  async create(commission: Omit<Commission, 'id' | 'createdAt'>): Promise<Commission> {
    await delay();
    const newCommission: Commission = {
      ...commission,
      id: `comm-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    mockCommissions.push(newCommission);
    return newCommission;
  },
};

// ==================== NOTIFICATION SERVICES ====================
export const notificationService = {
  async getTemplates(): Promise<NotificationTemplate[]> {
    await delay();
    return [...mockNotificationTemplates];
  },

  async updateTemplate(id: string, updates: Partial<NotificationTemplate>): Promise<NotificationTemplate | undefined> {
    await delay();
    const index = mockNotificationTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      mockNotificationTemplates[index] = { ...mockNotificationTemplates[index], ...updates };
      return mockNotificationTemplates[index];
    }
    return undefined;
  },

  async getLogs(filters?: { userId?: string; channel?: string }): Promise<NotificationLog[]> {
    await delay();
    let logs = [...mockNotificationLogs];
    if (filters?.userId) {
      logs = logs.filter(l => l.userId === filters.userId);
    }
    if (filters?.channel) {
      logs = logs.filter(l => l.channel === filters.channel);
    }
    return logs;
  },

  async sendNotification(
    userId: string,
    templateId: string,
    variables: Record<string, string>
  ): Promise<NotificationLog> {
    await delay();
    const template = mockNotificationTemplates.find(t => t.id === templateId);
    const user = mockUsers.find(u => u.id === userId);
    
    if (!template || !user) {
      throw new Error('Template or user not found');
    }

    let body = template.body;
    let subject = template.subject;
    
    for (const [key, value] of Object.entries(variables)) {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
      if (subject) {
        subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    }

    const log: NotificationLog = {
      id: `log-${generateId()}`,
      userId,
      templateId,
      channel: template.channel,
      recipient: template.channel === 'email' ? user.email : user.phone,
      subject,
      body,
      status: 'sent',
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    mockNotificationLogs.push(log);

    return log;
  },
};

// ==================== SLOT GENERATION ====================
export const slotService = {
  async getAvailableSlots(date: string, serviceId: string, staffId?: string): Promise<TimeSlot[]> {
    await delay();

    const service = mockServices.find(s => s.id === serviceId);
    if (!service) return [];

    const blocks = mockAvailabilityBlocks.filter(b => b.date === date);
    const existingApts = mockAppointments.filter(
      apt => apt.date === date && apt.status !== 'Cancelled' && (!staffId || apt.staffId === staffId)
    );

    // Generate time slots from 9 AM to 6 PM
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if blocked
        const isBlocked = blocks.some(b => {
          return time >= b.startTime && time < b.endTime;
        });

        // Check if slot overlaps with existing appointment
        const isBooked = existingApts.some(apt => {
          return time >= apt.startTime && time < apt.endTime;
        });

        slots.push({
          time,
          available: !isBlocked && !isBooked,
        });
      }
    }

    return slots;
  },
};

// ==================== SITE CONTENT SERVICES ====================
export const siteContentService = {
  async getAll(): Promise<SiteContent[]> {
    await delay();
    return [...mockSiteContent];
  },

  async getBySection(section: SiteContent['section']): Promise<SiteContent[]> {
    await delay();
    return mockSiteContent.filter(c => c.section === section);
  },

  async getByKey(key: string): Promise<SiteContent | undefined> {
    await delay();
    return mockSiteContent.find(c => c.key === key);
  },

  async update(id: string, value: string): Promise<SiteContent | undefined> {
    await delay();
    const index = mockSiteContent.findIndex(c => c.id === id);
    if (index !== -1) {
      mockSiteContent[index] = { 
        ...mockSiteContent[index], 
        value,
        updatedAt: new Date().toISOString() 
      };
      return mockSiteContent[index];
    }
    return undefined;
  },

  async create(content: Omit<SiteContent, 'id' | 'updatedAt'>): Promise<SiteContent> {
    await delay();
    const newContent: SiteContent = {
      ...content,
      id: `sc-${generateId()}`,
      updatedAt: new Date().toISOString(),
    };
    mockSiteContent.push(newContent);
    return newContent;
  },
};

// ==================== NAVIGATION SERVICES ====================
export const navigationService = {
  async getAll(): Promise<NavigationItem[]> {
    await delay();
    return [...mockNavigationItems].sort((a, b) => a.order - b.order);
  },

  async update(id: string, updates: Partial<NavigationItem>): Promise<NavigationItem | undefined> {
    await delay();
    const index = mockNavigationItems.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNavigationItems[index] = { ...mockNavigationItems[index], ...updates };
      return mockNavigationItems[index];
    }
    return undefined;
  },

  async reorder(items: { id: string; order: number }[]): Promise<NavigationItem[]> {
    await delay();
    for (const item of items) {
      const nav = mockNavigationItems.find(n => n.id === item.id);
      if (nav) {
        nav.order = item.order;
      }
    }
    return [...mockNavigationItems].sort((a, b) => a.order - b.order);
  },
};
