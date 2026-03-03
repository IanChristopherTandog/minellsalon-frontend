import React, { useEffect, useState } from 'react';
import { Calendar, Users, MessageSquare, TrendingUp, DollarSign, Gift, Award, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appointmentService, inquiryService, commissionService, loyaltyService } from '@/services/api';
import { AppointmentWithDetails, Inquiry, CommissionSummary, LoyaltyTransaction } from '@/types';
import { formatTime } from '@/utils/dateTime';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [todayApts, setTodayApts] = useState<AppointmentWithDetails[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary[]>([]);
  const [loyaltyStats, setLoyaltyStats] = useState({ totalEarned: 0, totalRedeemed: 0 });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    appointmentService.getByDate(today).then(setTodayApts);
    inquiryService.getOpen().then(setInquiries);
    commissionService.getSummary().then(setCommissionSummary);
    loyaltyService.getAllTransactions().then((transactions: LoyaltyTransaction[]) => {
      const earned = transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.points, 0);
      const redeemed = transactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + Math.abs(t.points), 0);
      setLoyaltyStats({ totalEarned: earned, totalRedeemed: redeemed });
    });
  }, []);

  const totalCommissions = commissionSummary.reduce((sum, s) => sum + s.totalCommission, 0);
  const pendingCommissions = commissionSummary.reduce((sum, s) => sum + s.pendingCommission, 0);

  const stats = [
    { label: "Today's Appointments", value: todayApts.length, icon: Calendar, color: 'bg-primary/10 text-primary' },
    { label: 'Open Inquiries', value: inquiries.length, icon: MessageSquare, color: 'bg-status-open/10 text-status-open' },
    { label: 'This Week', value: 12, icon: TrendingUp, color: 'bg-status-confirmed/10 text-status-confirmed' },
    { label: 'Total Clients', value: 156, icon: Users, color: 'bg-accent/20 text-accent-foreground' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="card-luxury p-5">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commission & Loyalty Widgets */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Commission Summary Widget */}
        <div className="card-luxury p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Commission Summary
            </h2>
            <Link to="/admin/commissions">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Total Commissions</p>
              <p className="text-2xl font-semibold text-foreground">${totalCommissions.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-status-pending/10">
              <p className="text-sm text-muted-foreground">Pending Payout</p>
              <p className="text-2xl font-semibold text-status-pending">${pendingCommissions.toFixed(2)}</p>
            </div>
          </div>
          <div className="space-y-2">
            {commissionSummary.slice(0, 3).map(staff => (
              <div key={staff.staffId} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50">
                <span className="font-medium">{staff.staffName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{staff.totalAppointments} appts</span>
                  <Badge variant="secondary">${staff.totalCommission.toFixed(0)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Program Widget */}
        <div className="card-luxury p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Loyalty Program Stats
            </h2>
            <Link to="/admin/loyalty">
              <Button variant="ghost" size="sm" className="text-xs">
                Manage <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-status-confirmed/10">
              <p className="text-sm text-muted-foreground">Points Issued</p>
              <p className="text-2xl font-semibold text-status-confirmed">{loyaltyStats.totalEarned.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <p className="text-sm text-muted-foreground">Points Redeemed</p>
              <p className="text-2xl font-semibold text-primary">{loyaltyStats.totalRedeemed.toLocaleString()}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Program Health</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {loyaltyStats.totalEarned > 0 
                ? `${((loyaltyStats.totalRedeemed / loyaltyStats.totalEarned) * 100).toFixed(1)}% redemption rate`
                : 'No points issued yet'}
            </p>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((loyaltyStats.totalRedeemed / Math.max(loyaltyStats.totalEarned, 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Inquiries */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-luxury p-5">
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          {todayApts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No appointments today</p>
          ) : (
            <div className="space-y-3">
              {todayApts.map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{apt.user?.name}</p>
                    <p className="text-sm text-muted-foreground">{apt.service?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatTime(apt.startTime)}</p>
                    <Badge variant={apt.status === 'Confirmed' ? 'confirmed' : 'pending'} className="mt-1">{apt.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-luxury p-5">
          <h2 className="text-lg font-semibold mb-4">Recent Inquiries</h2>
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground text-sm">No open inquiries</p>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 5).map(inq => (
                <div key={inq.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{inq.name}</p>
                    <Badge variant="open">{inq.topic}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{inq.messages[0]?.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
