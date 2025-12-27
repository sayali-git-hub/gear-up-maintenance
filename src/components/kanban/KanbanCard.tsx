import { MaintenanceRequest, getEquipmentById, getTechnicianById, getTeamById } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { cn } from '@/lib/utils';
import { Clock, Wrench, User, AlertTriangle, CheckCircle } from 'lucide-react';
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
  const team = equipment ? getTeamById(equipment.maintenanceTeamId) : null;
  
  const isOverdue = request.status !== 'repaired' && 
    request.status !== 'scrap' && 
    isPast(parseISO(request.scheduledDate));

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if not dragging
    if (!isDragging) {
      navigate(`/requests/${request.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-card border border-border rounded-xl p-4 cursor-grab transition-all duration-200',
        isDragging && 'shadow-xl rotate-2 scale-105',
        isOverdue && 'border-l-4 border-l-red-500',
        !isDragging && 'hover:shadow-md hover:border-primary/30 cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-medium text-sm leading-tight">{request.subject}</h4>
        <PriorityBadge priority={request.priority} />
      </div>
      
      <div className="space-y-2.5">
        {/* Equipment */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wrench className="w-3.5 h-3.5" />
          <span className="truncate">{equipment?.name || 'Unknown'}</span>
        </div>
        
        {/* Type badge */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            request.type === 'corrective' 
              ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' 
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          )}>
            {request.type === 'corrective' ? 'Corrective' : 'Preventive'}
          </span>
          {team && (
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ 
                backgroundColor: `${team.color}15`, 
                color: team.color 
              }}
            >
              {team.name}
            </span>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{format(parseISO(request.scheduledDate), 'MMM d')}</span>
            {isOverdue && (
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 ml-1" />
            )}
          </div>
          
          {technician ? (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {technician.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Unassigned</span>
          )}
        </div>
        
        {/* Time spent indicator */}
        {request.timeSpent > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((request.timeSpent / request.duration) * 100, 100)}%` }}
              />
            </div>
            <span className="text-muted-foreground">
              {request.timeSpent}h / {request.duration}h
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
