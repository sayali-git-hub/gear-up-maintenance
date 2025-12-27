import { cn } from '@/lib/utils';
import { MaintenanceStatus } from '@/lib/data';

interface StatusBadgeProps {
  status: MaintenanceStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<MaintenanceStatus, { label: string; className: string }> = {
  new: { 
    label: 'New', 
    className: 'bg-info/10 text-info border-info/20',
  },
  in_progress: { 
    label: 'In Progress', 
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  repaired: { 
    label: 'Repaired', 
    className: 'bg-success/10 text-success border-success/20',
  },
  scrap: { 
    label: 'Scrap', 
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      )}
    >
      {config.label}
    </span>
  );
};
