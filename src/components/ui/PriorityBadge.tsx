import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md';
}

const priorityConfig = {
  low: { 
    label: 'Low', 
    className: 'bg-muted text-muted-foreground border-border',
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-info/10 text-info border-info/20',
  },
  high: { 
    label: 'High', 
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  critical: { 
    label: 'Critical', 
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export const PriorityBadge = ({ priority, size = 'sm' }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
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
