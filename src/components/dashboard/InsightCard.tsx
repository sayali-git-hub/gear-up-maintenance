import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    bg: 'bg-red-500',
    text: 'text-white',
    iconBg: 'bg-red-600/50',
  },
  info: {
    bg: 'bg-blue-500',
    text: 'text-white',
    iconBg: 'bg-blue-600/50',
  },
  success: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    iconBg: 'bg-emerald-600/50',
  },
};

export const InsightCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  delay = 0,
  onClick,
}: InsightCardProps) => {
  const styles = variantStyles[variant];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl p-6 cursor-pointer transition-transform hover:scale-[1.02]',
        styles.bg,
        styles.text
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-80">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', styles.iconBg)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
