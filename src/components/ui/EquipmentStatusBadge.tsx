import { cn } from '@/lib/utils';
import { Equipment } from '@/lib/data';

interface EquipmentStatusBadgeProps {
  status: Equipment['status'];
  size?: 'sm' | 'md';
}

const statusConfig: Record<Equipment['status'], { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  maintenance: { label: 'Maintenance', className: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  scrapped: { label: 'Scrapped', className: 'bg-red-500/15 text-red-600 border-red-500/30' },
};

export const EquipmentStatusBadge = ({ status, size = 'md' }: EquipmentStatusBadgeProps) => {
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
