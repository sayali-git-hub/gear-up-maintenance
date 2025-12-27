import { MaintenanceRequest, getEquipmentById, getTechnicianById, getTeamById, MaintenanceStatus } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { cn } from '@/lib/utils';
import { Clock, Wrench, AlertTriangle, GripVertical } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface KanbanCardProps {
  request: MaintenanceRequest;
  isDragging?: boolean;
}

const statusAccent: Record<MaintenanceStatus, string> = {
  new: 'border-l-[hsl(var(--status-new))]',
  in_progress: 'border-l-[hsl(var(--status-progress))]',
  repaired: 'border-l-[hsl(var(--status-repaired))]',
  scrap: 'border-l-[hsl(var(--status-scrap))]',
};

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-card border border-border rounded-xl p-4 transition-all duration-200 border-l-4',
        statusAccent[request.status],
        isDragging && 'shadow-2xl rotate-1 scale-[1.02] ring-2 ring-primary/20',
        isOverdue && !isDragging && 'ring-1 ring-destructive/30 bg-destructive/5',
        !isDragging && 'hover:shadow-lg hover:border-primary/20 cursor-pointer hover:-translate-y-0.5'
      )}
    >
      {/* Drag Handle & Priority */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className={cn(
            'w-4 h-4 text-muted-foreground/40 flex-shrink-0 transition-colors',
            isDragging && 'text-primary'
          )} />
          <h4 className="font-medium text-sm leading-tight truncate">{request.subject}</h4>
        </div>
        <PriorityBadge priority={request.priority} />
      </div>
      
      <div className="space-y-3">
        {/* Equipment */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{equipment?.name || 'Unknown'}</span>
        </div>
        
        {/* Type & Team badges */}
        <div className="flex items-center gap-2 flex-wrap">
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
        
        {/* Footer: Date & Technician */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className={cn(
            'flex items-center gap-1.5 text-xs',
            isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
          )}>
            <Clock className="w-3.5 h-3.5" />
            <span>{format(parseISO(request.scheduledDate), 'MMM d')}</span>
            {isOverdue && (
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            )}
          </div>
          
          {technician ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6 border border-border">
                <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                  {getInitials(technician.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground">
                {technician.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground/60 italic px-2 py-0.5 rounded bg-muted/50">
              Unassigned
            </span>
          )}
        </div>
        
        {/* Progress bar */}
        {request.timeSpent > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  request.timeSpent >= request.duration 
                    ? 'bg-[hsl(var(--status-repaired))]' 
                    : 'bg-primary'
                )}
                style={{ width: `${Math.min((request.timeSpent / request.duration) * 100, 100)}%` }}
              />
            </div>
            <span className="text-muted-foreground whitespace-nowrap">
              {request.timeSpent}h / {request.duration}h
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
