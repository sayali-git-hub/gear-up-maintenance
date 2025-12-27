import { cn } from '@/lib/utils';
import { MaintenanceStatus } from '@/lib/data';

interface StatusBadgeProps {
  status: MaintenanceStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<MaintenanceStatus, { label: string; className: string }> = {
  new: { 
    label: 'New', 
    className: 'bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary' 
  },
  in_progress: { 
    label: 'In Progress', 
    className: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' 
  },
  repaired: { 
    label: 'Completed', 
    className: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' 
  },
  scrap: { 
    label: 'Scrapped', 
    className: 'bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400' 
  },
};

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'status-pill',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
      )}
    >
      {config.label}
    </span>
  );
};
