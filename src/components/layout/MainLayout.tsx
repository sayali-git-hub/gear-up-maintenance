import { AppSidebar } from './AppSidebar';
import { useSidebarContext } from '@/contexts/SidebarContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { collapsed } = useSidebarContext();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main 
        className="flex-1 overflow-auto transition-[margin] duration-200 ease-in-out"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        {children}
      </main>
    </div>
  );
};
