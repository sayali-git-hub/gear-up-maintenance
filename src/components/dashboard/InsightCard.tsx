import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant: 'critical' | 'info' | 'success';
  delay?: number;
  onClick?: () => void;
}

const variantStyles = {
  critical: {
    border: 'border-destructive/20',
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    valueBg: 'bg-destructive/5',
  },
  info: {
    border: 'border-info/20',
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
    valueBg: 'bg-info/5',
  },
  success: {
    border: 'border-success/20',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    valueBg: 'bg-success/5',
  },
};

export const InsightCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  onClick,
}: InsightCardProps) => {
  const styles = variantStyles[variant];
  
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border rounded-lg p-5 cursor-pointer transition-all hover:shadow-sm',
        styles.border
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg', styles.iconBg)}>
          <Icon className={cn('w-5 h-5', styles.iconColor)} />
        </div>
      </div>
    </div>
  );
};
