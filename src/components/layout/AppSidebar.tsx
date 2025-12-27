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
  LogOut,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { ProfileDialog } from '@/components/dialogs/ProfileDialog';
import { ThemeToggle, ThemeToggleCompact } from '@/components/ui/ThemeToggle';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import gearGuardLogo from '@/assets/gear-guard-logo.png';
import gearGuardLogoDark from '@/assets/gear-guard-logo-dark.png';

// Navigation grouped logically
const navGroups = [
  {
    label: 'Operations',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      { icon: Kanban, label: 'Requests', path: '/kanban' },
      { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { icon: Settings2, label: 'Equipment', path: '/equipment' },
      { icon: Users, label: 'Teams', path: '/teams' },
    ],
  },
];

export const AppSidebar = () => {
  const location = useLocation();
  const { userProfile } = useData();
  const { logout } = useAuth();
  const { collapsed, setCollapsed } = useSidebarContext();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="h-screen bg-sidebar flex flex-col border-r border-sidebar-border fixed left-0 top-0 bottom-0 z-40"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <img 
              src={isDark ? gearGuardLogoDark : gearGuardLogo} 
              alt="GearGuard Logo" 
              className="w-8 h-8 object-contain"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.1 }}
                >
                  <span className="text-base font-semibold text-sidebar-foreground tracking-tight">
                    GearGuard
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 mb-1.5 text-[10px] font-medium uppercase tracking-wider text-sidebar-muted"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-100',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      )}
                    >
                      <item.icon 
                        className="w-[18px] h-[18px] flex-shrink-0" 
                        strokeWidth={isActive ? 2 : 1.75} 
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.1 }}
                            className="text-sm"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center transition-colors duration-100 hover:bg-secondary z-10"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Theme Toggle */}
        <div className="px-2 py-2 border-t border-sidebar-border">
          {collapsed ? (
            <ThemeToggleCompact />
          ) : (
            <ThemeToggle />
          )}
        </div>

        {/* Footer - Profile & Logout */}
        <div className="p-3 border-t border-sidebar-border space-y-1.5">
          <button
            onClick={() => setShowProfileDialog(true)}
            className="w-full flex items-center gap-2.5 hover:bg-sidebar-accent rounded-lg p-1.5 -m-1.5 transition-colors duration-100"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
              {userProfile.name ? getInitials(userProfile.name) : <User className="w-3.5 h-3.5" />}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {userProfile.name}
                  </p>
                  <p className="text-[11px] text-sidebar-muted truncate">
                    {userProfile.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          {/* Logout button */}
          {collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="w-9 h-9 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-2.5 px-3 py-2 h-auto text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Sign Out</span>
            </Button>
          )}
        </div>
      </motion.aside>

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </>
  );
};
