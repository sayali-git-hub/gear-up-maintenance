import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings2, 
  Users, 
  Calendar,
  Kanban,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/contexts/DataContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { ProfileDialog } from '@/components/dialogs/ProfileDialog';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Kanban, label: 'Requests', path: '/kanban' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Settings2, label: 'Equipment', path: '/equipment' },
  { icon: Users, label: 'Teams', path: '/teams' },
];

export const AppSidebar = () => {
  const location = useLocation();
  const { userProfile } = useData();
  const { collapsed, setCollapsed } = useSidebarContext();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <aside
        className={cn(
          'h-screen bg-sidebar flex flex-col border-r border-sidebar-border fixed left-0 top-0 bottom-0 z-40 transition-[width] duration-200 ease-in-out',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">G</span>
            </div>
            {!collapsed && (
              <span className="text-base font-semibold text-sidebar-foreground">GearGuard</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-md mb-0.5 transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && (
              <span className="text-xs text-sidebar-foreground/60">Theme</span>
            )}
            <ThemeToggle />
          </div>
          
          <button
            onClick={() => setShowProfileDialog(true)}
            className={cn(
              'w-full flex items-center gap-2.5 hover:bg-sidebar-accent rounded-md p-1.5 transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground text-xs font-medium">
              {userProfile.name ? getInitials(userProfile.name) : <User className="w-3.5 h-3.5" />}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {userProfile.email}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </>
  );
};
