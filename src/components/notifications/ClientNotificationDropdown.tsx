import React from 'react';
import { Bell, Calendar, Gift, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { InAppNotification, InAppNotificationType } from '@/types';
import { cn } from '@/lib/utils';

interface ClientNotificationDropdownProps {
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

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

const getNotificationBadge = (type: InAppNotificationType) => {
  switch (type) {
    case 'loyalty_earned':
      return { label: 'Points Earned', variant: 'confirmed' as const };
    case 'loyalty_redeemed':
      return { label: 'Reward Claimed', variant: 'open' as const };
    case 'appointment_confirmed':
      return { label: 'Confirmed', variant: 'confirmed' as const };
    case 'appointment_cancelled':
      return { label: 'Cancelled', variant: 'cancelled' as const };
    default:
      return null;
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
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const ClientNotificationDropdown: React.FC<ClientNotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const loyaltyNotifications = notifications.filter(
    n => n.type === 'loyalty_earned' || n.type === 'loyalty_redeemed'
  );
  const totalPointsEarned = loyaltyNotifications
    .filter(n => n.type === 'loyalty_earned')
    .reduce((sum, n) => {
      const points = n.metadata?.points as number || 0;
      return sum + points;
    }, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover border border-border shadow-lg z-50">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                onMarkAllAsRead();
              }}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        
        {totalPointsEarned > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 bg-primary/5 border-b border-border">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  You've earned <span className="text-primary">{totalPointsEarned} points</span> recently!
                </span>
              </div>
            </div>
          </>
        )}
        
        <DropdownMenuSeparator />
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 20).map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const badge = getNotificationBadge(notification.type);
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-3 cursor-pointer focus:bg-muted',
                    !notification.isRead && 'bg-primary/5'
                  )}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="mt-0.5 flex-shrink-0 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        'text-sm leading-tight',
                        !notification.isRead && 'font-medium'
                      )}>
                        {notification.title}
                      </p>
                      {badge && (
                        <Badge variant={badge.variant} className="text-[10px] h-4">
                          {badge.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
