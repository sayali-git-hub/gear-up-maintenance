import { MaintenanceRequest } from '@/lib/data';
import { getEquipmentById, getTechnicianById, getTeamById } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Calendar, Clock, Settings2, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  request: MaintenanceRequest;
  index: number;
}

export const DashboardCard = ({ request, index }: DashboardCardProps) => {
  const navigate = useNavigate();
  const equipment = getEquipmentById(request.equipmentId);
  const technician = request.assignedTechnicianId 
    ? getTechnicianById(request.assignedTechnicianId) 
    : null;
  const team = request.teamId ? getTeamById(request.teamId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/requests/${request.id}`)}
      className="bg-card border border-border rounded-xl p-4 space-y-3 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <Badge variant="outline" className="font-mono text-xs mb-2">
            {request.id.toUpperCase()}
          </Badge>
          <h3 className="font-medium line-clamp-2">{request.subject}</h3>
        </div>
        <PriorityBadge priority={request.priority} />
      </div>

      {/* Equipment */}
      {equipment && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Settings2 className="w-4 h-4" />
          <span className="truncate">{equipment.name}</span>
        </div>
      )}

      {/* Technician */}
      <div className="flex items-center gap-2 text-sm">
        {technician ? (
          <>
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: team?.color || '#6366f1' }}
            >
              {technician.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span>{technician.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        )}
      </div>

      {/* Date & Status */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {format(parseISO(request.scheduledDate), 'MMM d, yyyy')}
        </div>
        <StatusBadge status={request.status} size="sm" />
      </div>
    </motion.div>
  );
};
