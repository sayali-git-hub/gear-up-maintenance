import { Equipment, getTeamById, getOpenRequestsCount } from '@/lib/data';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Wrench, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface EquipmentCardProps {
  equipment: Equipment;
  delay?: number;
}

const statusIcons = {
  active: CheckCircle,
  maintenance: AlertCircle,
  scrapped: XCircle,
};

const statusStyles = {
  active: 'text-emerald-600 bg-emerald-500/10',
  maintenance: 'text-amber-600 bg-amber-500/10',
  scrapped: 'text-red-600 bg-red-500/10',
};

export const EquipmentCard = ({ equipment, delay = 0 }: EquipmentCardProps) => {
  const team = getTeamById(equipment.maintenanceTeamId);
  const openRequests = getOpenRequestsCount(equipment.id);
  const navigate = useNavigate();
  const StatusIcon = statusIcons[equipment.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200',
        'hover:border-primary/30 group',
        equipment.status === 'scrapped' && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {equipment.name}
          </h3>
          <p className="text-sm text-muted-foreground font-mono">{equipment.serialNumber}</p>
        </div>
        <div className={cn('p-2 rounded-lg', statusStyles[equipment.status])}>
          <StatusIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{equipment.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Warranty: {format(parseISO(equipment.warrantyExpiry), 'MMM d, yyyy')}</span>
        </div>
        {team && (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: team.color }}
            />
            <span className="text-sm font-medium">{team.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => navigate(`/equipment/${equipment.id}`)}
        >
          <Wrench className="w-4 h-4" />
          Maintenance
          {openRequests > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
              {openRequests}
            </span>
          )}
        </Button>
        <span className="text-xs text-muted-foreground capitalize">
          {equipment.department}
        </span>
      </div>
    </motion.div>
  );
};
