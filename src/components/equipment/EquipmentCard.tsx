import { Equipment, getTeamById, getOpenRequestsCount } from '@/lib/data';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Wrench, AlertCircle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface EquipmentCardProps {
  equipment: Equipment;
}

const statusConfig = {
  active: { 
    icon: CheckCircle, 
    label: 'Active',
    className: 'text-success bg-success/10 border-success/20' 
  },
  maintenance: { 
    icon: AlertCircle, 
    label: 'Maintenance',
    className: 'text-warning bg-warning/10 border-warning/20' 
  },
  scrapped: { 
    icon: XCircle, 
    label: 'Scrapped',
    className: 'text-destructive bg-destructive/10 border-destructive/20' 
  },
};

export const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
  const team = getTeamById(equipment.maintenanceTeamId);
  const openRequests = getOpenRequestsCount(equipment.id);
  const navigate = useNavigate();
  const config = statusConfig[equipment.status];
  const StatusIcon = config.icon;
  const warrantyExpired = isPast(parseISO(equipment.warrantyExpiry));

  return (
    <div
      onClick={() => navigate(`/equipment/${equipment.id}`)}
      className={cn(
        'bg-card border border-border rounded-xl p-5 cursor-pointer group',
        'transition-all duration-200 hover:shadow-lg hover:border-primary/30',
        'hover:-translate-y-0.5',
        equipment.status === 'scrapped' && 'opacity-60'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {equipment.name}
            </h3>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground font-mono">{equipment.serialNumber}</p>
        </div>
        <Badge variant="outline" className={cn('gap-1.5 font-medium', config.className)}>
          <StatusIcon className="w-3.5 h-3.5" />
          {config.label}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{equipment.location}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className={cn('w-4 h-4 flex-shrink-0', warrantyExpired ? 'text-destructive' : 'text-muted-foreground')} />
          <span className={cn(warrantyExpired && 'text-destructive')}>
            Warranty: {format(parseISO(equipment.warrantyExpiry), 'MMM d, yyyy')}
            {warrantyExpired && ' (Expired)'}
          </span>
        </div>
        {team && (
          <div className="flex items-center gap-2.5">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: team.color }}
            />
            <span className="text-sm font-medium">{team.name}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-primary/10 hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/equipment/${equipment.id}`);
          }}
        >
          <Wrench className="w-4 h-4" />
          Maintenance
          {openRequests > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full animate-pulse">
              {openRequests}
            </span>
          )}
        </Button>
        <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted/50 rounded">
          {equipment.department}
        </span>
      </div>
    </div>
  );
};
