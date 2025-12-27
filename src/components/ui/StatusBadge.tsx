import { cn } from '@/lib/utils';
import { MaintenanceStatus } from '@/lib/data';

interface StatusBadgeProps {
  status: MaintenanceStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<MaintenanceStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-status-new/15 text-status-new border-status-new/30' },
  in_progress: { label: 'In Progress', className: 'bg-status-progress/15 text-status-progress border-status-progress/30' },
  repaired: { label: 'Repaired', className: 'bg-status-repaired/15 text-status-repaired border-status-repaired/30' },
  scrap: { label: 'Scrap', className: 'bg-status-scrap/15 text-status-scrap border-status-scrap/30' },
};

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {config.label}
    </span>
  );
};
