import React, { useState } from 'react';
import { Bell, Gift, Calendar, MessageSquare, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockClientNotifications } from '@/data/mockData';
import { InAppNotification, InAppNotificationType } from '@/types';
import { cn } from '@/lib/utils';

const getNotificationIcon = (type: InAppNotificationType) => {
  switch (type) {
    case 'appointment_new':
    case 'appointment_confirmed':
    case 'appointment_cancelled':
    case 'appointment_rescheduled':
      return Calendar;
    case 'inquiry_reply':
      return MessageSquare;
    case 'loyalty_earned':
    case 'loyalty_redeemed':
      return Gift;
    default:
      return Bell;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const ClientNotifications = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>(mockClientNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const loyaltyNotifications = notifications.filter(
    n => n.type === 'loyalty_earned' || n.type === 'loyalty_redeemed'
  );

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return unreadNotifications;
      case 'loyalty':
        return loyaltyNotifications;
      default:
        return notifications;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = getFilteredNotifications();
  const totalPoints = loyaltyNotifications
    .filter(n => n.type === 'loyalty_earned')
    .reduce((sum, n) => sum + ((n.metadata?.points as number) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your appointments and rewards</p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Loyalty Summary Card */}
      <div className="card-luxury p-6 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recent Points Earned</p>
            <p className="text-2xl font-semibold text-foreground">{totalPoints} points</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="loyalty">
            Rewards ({loyaltyNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <div className="card-luxury p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No notifications to show</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'card-luxury p-4 flex items-start gap-4 transition-all',
                      !notification.isRead && 'border-l-4 border-l-primary'
                    )}
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn(
                            'font-medium text-foreground',
                            !notification.isRead && 'font-semibold'
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {notification.type === 'loyalty_earned' && notification.metadata?.points && (
                            <Badge variant="confirmed" className="text-xs">
                              +{String(notification.metadata.points)} pts
                            </Badge>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientNotifications;
