import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Clock,
  BarChart3,
  Image,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronDown,
  User,
  UserCog,
  DollarSign,
  Gift,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationDropdown } from '@/components/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { mockAdminNotifications } from '@/data/mockData';
import { InAppNotification } from '@/types';

interface SidebarLink {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
  badge?: number;
  children?: { href: string; label: string }[];
}

const sidebarLinks: SidebarLink[] = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { 
    href: '/admin/users', 
    icon: Users, 
    label: 'Users',
    children: [
      { href: '/admin/users?type=admin', label: 'Admins' },
      { href: '/admin/users?type=client', label: 'Clients' },
      { href: '/admin/staff', label: 'Staff' },
    ]
  },
  { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries', badge: 2 },
  { href: '/admin/content', icon: FileText, label: 'Content' },
  { href: '/admin/availability', icon: Clock, label: 'Availability' },
  { href: '/admin/commissions', icon: DollarSign, label: 'Commissions' },
  { href: '/admin/loyalty', icon: Gift, label: 'Loyalty' },
  { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
  { href: '/admin/media', icon: Image, label: 'Media' },
  { href: '/admin/profile', icon: User, label: 'Profile' },
];

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['/admin/users']);
  const [notifications, setNotifications] = useState<InAppNotification[]>(mockAdminNotifications);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href.split('?')[0]);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleGroup = (href: string) => {
    setExpandedGroups(prev => 
      prev.includes(href) 
        ? prev.filter(h => h !== href)
        : [...prev, href]
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Auto-expand parent group if child is active
  useEffect(() => {
    sidebarLinks.forEach(link => {
      if (link.children) {
        const isChildActive = link.children.some(child => 
          location.pathname.startsWith(child.href.split('?')[0])
        );
        if (isChildActive && !expandedGroups.includes(link.href)) {
          setExpandedGroups(prev => [...prev, link.href]);
        }
      }
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
          isSidebarOpen ? 'w-64' : 'w-20',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border flex-shrink-0">
          {isSidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-serif text-xl font-semibold text-sidebar-foreground">
                Minell's
              </span>
              <Badge variant="secondary" className="text-[10px]">
                Admin
              </Badge>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-sidebar-foreground"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform', !isSidebarOpen && 'rotate-180')} />
          </Button>
        </div>

        {/* Navigation - Scrollable */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-4 space-y-1">
            {sidebarLinks.map(link => {
              if (link.children) {
                const isGroupActive = link.children.some(child => 
                  location.pathname.startsWith(child.href.split('?')[0]) || 
                  location.pathname === '/admin/staff'
                );
                const isExpanded = expandedGroups.includes(link.href);

                return (
                  <Collapsible key={link.href} open={isExpanded}>
                    <CollapsibleTrigger
                      onClick={() => toggleGroup(link.href)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
                        isGroupActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      )}
                    >
                      <link.icon className="h-5 w-5 flex-shrink-0" />
                      {isSidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{link.label}</span>
                          <ChevronDown className={cn(
                            'h-4 w-4 transition-transform',
                            isExpanded && 'rotate-180'
                          )} />
                        </>
                      )}
                    </CollapsibleTrigger>
                    {isSidebarOpen && (
                      <CollapsibleContent className="pl-8 mt-1 space-y-1">
                        {link.children.map(child => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={cn(
                              'block px-3 py-2 rounded-lg text-sm transition-colors',
                              (location.pathname + location.search === child.href || 
                               (child.href === '/admin/staff' && location.pathname === '/admin/staff'))
                                ? 'bg-sidebar-accent/70 text-sidebar-primary'
                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/30'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                );
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href, link.exact)
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1">{link.label}</span>
                      {link.badge && (
                        <Badge className="h-5 min-w-[20px] px-1.5 text-[10px]">
                          {link.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer - Fixed */}
        <div className="p-4 border-t border-sidebar-border flex-shrink-0">
          <div
            className={cn(
              'flex items-center gap-3',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-foreground">
                {sidebarLinks.find(l => isActive(l.href, l.exact))?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationDropdown
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
              <Link to="/" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
