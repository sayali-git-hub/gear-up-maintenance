import { cn } from '@/lib/utils';
import { MaintenanceStatus } from '@/lib/data';

interface StatusBadgeProps {
  status: MaintenanceStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

const statusConfig: Record<MaintenanceStatus, { label: string; className: string; dotClass: string }> = {
  new: { 
    label: 'New', 
    className: 'bg-status-new/10 text-status-new border-status-new/20',
    dotClass: 'bg-status-new'
  },
  in_progress: { 
    label: 'In Progress', 
    className: 'bg-status-progress/10 text-status-progress border-status-progress/20',
    dotClass: 'bg-status-progress animate-pulse'
  },
  repaired: { 
    label: 'Repaired', 
    className: 'bg-status-repaired/10 text-status-repaired border-status-repaired/20',
    dotClass: 'bg-status-repaired'
  },
  scrap: { 
    label: 'Scrap', 
    className: 'bg-status-scrap/10 text-status-scrap border-status-scrap/20',
    dotClass: 'bg-status-scrap'
  },
};

export const StatusBadge = ({ status, size = 'md', showDot = true }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dotClass)} />
      )}
      {config.label}
    </span>
  );
};
