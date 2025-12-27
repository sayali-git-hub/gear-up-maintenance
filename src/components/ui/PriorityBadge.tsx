import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  high: { label: 'High', className: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
  critical: { label: 'Critical', className: 'bg-red-500/15 text-red-600 dark:text-red-400 animate-pulse-glow' },
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
};
