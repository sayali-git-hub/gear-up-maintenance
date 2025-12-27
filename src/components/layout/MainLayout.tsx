import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { collapsed } = useSidebarContext();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <motion.main 
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex-1 overflow-auto"
      >
        {children}
      </motion.main>
    </div>
  );
};
