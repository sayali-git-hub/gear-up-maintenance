import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  showDot?: boolean;
  size?: 'sm' | 'md';
}

const priorityConfig = {
  low: { 
    label: 'Low', 
    className: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-muted-foreground/60'
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20',
    dotClass: 'bg-priority-medium'
  },
  high: { 
    label: 'High', 
    className: 'bg-priority-high/10 text-priority-high border-priority-high/20',
    dotClass: 'bg-priority-high'
  },
  critical: { 
    label: 'Critical', 
    className: 'bg-priority-critical/10 text-priority-critical border-priority-critical/20',
    dotClass: 'bg-priority-critical animate-pulse'
  },
};

export const PriorityBadge = ({ priority, showDot = true, size = 'sm' }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
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
