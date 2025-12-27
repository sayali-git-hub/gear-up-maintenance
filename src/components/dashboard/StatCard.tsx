import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color?: 'primary' | 'blue' | 'green' | 'orange' | 'red';
  delay?: number;
}

const colorStyles = {
  primary: 'from-primary/20 to-primary/5 border-primary/20',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
  green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
  orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/20',
  red: 'from-red-500/20 to-red-500/5 border-red-500/20',
};

const iconColorStyles = {
  primary: 'bg-primary text-primary-foreground',
  blue: 'bg-blue-500 text-white',
  green: 'bg-emerald-500 text-white',
  orange: 'bg-orange-500 text-white',
  red: 'bg-red-500 text-white',
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-6',
        'bg-card glow-card',
        colorStyles[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.positive ? 'text-emerald-600' : 'text-red-500'
                )}
              >
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconColorStyles[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
