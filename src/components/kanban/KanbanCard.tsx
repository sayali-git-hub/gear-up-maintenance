import { MaintenanceRequest, getEquipmentById, getTechnicianById, getTeamById } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { cn } from '@/lib/utils';
import { Clock, Wrench, User, AlertTriangle } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

interface KanbanCardProps {
  request: MaintenanceRequest;
  isDragging?: boolean;
}

export const KanbanCard = ({ request, isDragging }: KanbanCardProps) => {
  const navigate = useNavigate();
  const equipment = getEquipmentById(request.equipmentId);
  const technician = request.assignedTechnicianId 
    ? getTechnicianById(request.assignedTechnicianId) 
    : null;
  const team = request.teamId ? getTeamById(request.teamId) : null;
  
  const isOverdue = request.status !== 'repaired' && 
    request.status !== 'scrap' && 
    isPast(parseISO(request.scheduledDate));

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      navigate(`/requests/${request.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-card border border-border rounded-lg p-3 cursor-grab transition-all',
        isDragging && 'shadow-lg ring-2 ring-primary/20 rotate-1',
        isOverdue && 'border-l-2 border-l-destructive',
        !isDragging && 'hover:border-primary/30 cursor-pointer'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium leading-tight text-foreground line-clamp-2">{request.subject}</h4>
        <PriorityBadge priority={request.priority} />
      </div>
      
      {/* Equipment */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
        <Wrench className="w-3 h-3" />
        <span className="truncate">{equipment?.name || 'Unknown'}</span>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className={cn(
          'text-xs px-1.5 py-0.5 rounded font-medium',
          request.type === 'corrective' 
            ? 'bg-warning/10 text-warning' 
            : 'bg-info/10 text-info'
        )}>
          {request.type === 'corrective' ? 'Corrective' : 'Preventive'}
        </span>
        {team && (
          <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-muted text-muted-foreground">
            {team.name}
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{format(parseISO(request.scheduledDate), 'MMM d')}</span>
          {isOverdue && <AlertTriangle className="w-3 h-3 text-destructive ml-1" />}
        </div>
        
        {technician ? (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">{technician.name.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Unassigned</span>
        )}
      </div>
    </div>
  );
};
