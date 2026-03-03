import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, Calendar, Settings, LogOut, ChevronRight, Gift, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ClientNotificationDropdown } from '@/components/notifications';
import { mockClientNotifications } from '@/data/mockData';
import { InAppNotification } from '@/types';

const sidebarLinks = [
  { href: '/client', icon: User, label: 'Profile', exact: true },
  { href: '/client/appointments', icon: Calendar, label: 'My Appointments' },
  { href: '/client/loyalty', icon: Gift, label: 'Loyalty Rewards' },
  { href: '/client/notifications', icon: Bell, label: 'Notifications' },
  { href: '/client/settings', icon: Settings, label: 'Settings' },
];

export const ClientLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>(
    mockClientNotifications.filter(n => n.userId === user?.id || n.userId === 'user-1')
  );

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-semibold text-foreground">
                Minell's
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <ClientNotificationDropdown
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Back to Site
                </Button>
              </Link>
              <Link to="/book">
                <Button size="sm">Book Appointment</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card-luxury p-6 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {user?.loyaltyPoints !== undefined && user?.loyaltyPoints > 0 && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      <Gift className="h-3 w-3 mr-1" />
                      {user.loyaltyPoints} pts
                    </Badge>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {sidebarLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive(link.href, link.exact)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="flex-1">{link.label}</span>
                    {link.href === '/client/notifications' && unreadCount > 0 && (
                      <Badge className="h-5 min-w-[20px] px-1.5 text-[10px]">
                        {unreadCount}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted w-full transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="flex-1 text-left">Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
