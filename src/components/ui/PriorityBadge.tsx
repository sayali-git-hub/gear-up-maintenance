import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const priorityConfig = {
  low: { 
    label: 'Low', 
    className: 'bg-muted text-muted-foreground' 
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-primary/10 text-primary dark:bg-primary/15' 
  },
  high: { 
    label: 'High', 
    className: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' 
  },
  critical: { 
    label: 'Critical', 
    className: 'bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400' 
  },
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  return (
    <span
      className={cn(
        'status-pill',
        config.className
      )}
    >
      {config.label}
    </span>
  );
};
