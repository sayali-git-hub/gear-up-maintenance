import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant: 'critical' | 'info' | 'success' | 'warning' | 'neutral';
  trend?: { value: number; label?: string };
  delay?: number;
  onClick?: () => void;
}

const variantStyles = {
  critical: {
    container: 'border-red-200/50 dark:border-red-500/20',
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    iconColor: 'text-red-500 dark:text-red-400',
    valueColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    container: 'border-amber-200/50 dark:border-amber-500/20',
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    iconColor: 'text-amber-500 dark:text-amber-400',
    valueColor: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    container: 'border-primary/20',
    iconBg: 'bg-primary/5 dark:bg-primary/10',
    iconColor: 'text-primary',
    valueColor: 'text-primary',
  },
  success: {
    container: 'border-emerald-200/50 dark:border-emerald-500/20',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    valueColor: 'text-emerald-600 dark:text-emerald-400',
  },
  neutral: {
    container: 'border-border',
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    valueColor: 'text-foreground',
  },
};

export const InsightCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  trend,
  delay = 0,
  onClick,
}: InsightCardProps) => {
  const styles = variantStyles[variant];
  
  const TrendIcon = trend 
    ? trend.value > 0 
      ? TrendingUp 
      : trend.value < 0 
        ? TrendingDown 
        : Minus
    : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'kpi-card border cursor-pointer hover-lift',
        styles.container
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          
          {/* Value */}
          <div className="flex items-baseline gap-2">
            <p className={cn('text-3xl font-semibold tracking-tight', styles.valueColor)}>
              {value}
            </p>
            
            {/* Trend Indicator */}
            {trend && TrendIcon && (
              <span className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded',
                trend.value > 0 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : trend.value < 0
                    ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                    : 'bg-muted text-muted-foreground'
              )}>
                <TrendIcon className="w-3 h-3" />
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          
          {/* Subtitle / Context */}
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Icon */}
        <div className={cn('p-2.5 rounded-lg', styles.iconBg)}>
          <Icon className={cn('w-5 h-5', styles.iconColor)} strokeWidth={1.75} />
        </div>
      </div>
    </motion.div>
  );
};
