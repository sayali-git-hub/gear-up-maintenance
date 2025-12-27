import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { getEquipmentById, getTeamById, getTechnicianById } from '@/lib/data';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Wrench,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Settings2,
  FileText,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { cn } from '@/lib/utils';

const statusConfig = {
  new: { icon: AlertCircle, label: 'New Request', className: 'text-blue-600 bg-blue-500/10', color: 'bg-blue-500' },
  in_progress: { icon: Play, label: 'In Progress', className: 'text-amber-600 bg-amber-500/10', color: 'bg-amber-500' },
  repaired: { icon: CheckCircle, label: 'Repaired', className: 'text-emerald-600 bg-emerald-500/10', color: 'bg-emerald-500' },
  scrap: { icon: XCircle, label: 'Scrapped', className: 'text-red-600 bg-red-500/10', color: 'bg-red-500' },
};

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, updateRequestStatus } = useData();
  const { user } = useAuth();

  const request = requests.find(r => r.id === id);

  if (!request) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Request not found</p>
          <Button onClick={() => navigate('/kanban')} className="mt-4">
            Back to Requests
          </Button>
        </div>
      </MainLayout>
    );
  }

  const equipment = getEquipmentById(request.equipmentId);
  const team = request.teamId ? getTeamById(request.teamId) : null;
  const technician = request.assignedTechnicianId 
    ? getTechnicianById(request.assignedTechnicianId) 
    : null;
  const statusInfo = statusConfig[request.status];
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = (newStatus: 'new' | 'in_progress' | 'repaired' | 'scrap') => {
    updateRequestStatus(request.id, newStatus);
  };

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={cn('p-4 rounded-xl', statusInfo.className)}>
                <Wrench className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {request.id.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {request.type}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{request.subject}</h1>
                <p className="text-muted-foreground mt-1">{request.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full', statusInfo.className)}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{statusInfo.label}</span>
                  </div>
                  <PriorityBadge priority={request.priority} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {request.status === 'new' && (
                <Button onClick={() => handleStatusChange('in_progress')} className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Work
                </Button>
              )}
              {request.status === 'in_progress' && (
                <>
                  <Button onClick={() => handleStatusChange('repaired')} variant="default" className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </Button>
                  <Button onClick={() => handleStatusChange('scrap')} variant="destructive" className="gap-2">
                    <XCircle className="w-4 h-4" />
                    Mark as Scrap
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Request Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Scheduled Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(request.scheduledDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{request.duration} hours estimated</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Time Spent</p>
                  <p className="text-sm text-muted-foreground">{request.timeSpent} hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(request.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {user && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Created By</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Equipment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Equipment
            </h2>
            
            {equipment ? (
              <div 
                className="space-y-4 cursor-pointer hover:bg-muted/50 -m-2 p-2 rounded-lg transition-colors"
                onClick={() => navigate(`/equipment/${equipment.id}`)}
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{equipment.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{equipment.serialNumber}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm">{equipment.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm">{equipment.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Equipment not found</p>
            )}
          </motion.div>

          {/* Team & Technician */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Assignment
            </h2>
            
            {team && (
              <div 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => navigate(`/teams/${team.id}`)}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${team.color}20` }}
                >
                  <Users className="w-5 h-5" style={{ color: team.color }} />
                </div>
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-xs text-muted-foreground">{team.description}</p>
                </div>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Assigned Technician
              </p>
              {technician ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                    style={{ backgroundColor: team?.color || '#6366f1' }}
                  >
                    {technician.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{technician.name}</p>
                    <p className="text-xs text-muted-foreground">{technician.email}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-border text-center">
                  <p className="text-sm text-muted-foreground">No technician assigned</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="font-semibold text-lg mb-4">Workflow Progress</h2>
          <div className="flex items-center gap-4">
            {(['new', 'in_progress', 'repaired'] as const).map((status, index) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const isActive = request.status === status;
              const isPast = ['new', 'in_progress', 'repaired', 'scrap'].indexOf(request.status) > index;
              
              return (
                <div key={status} className="flex items-center gap-4 flex-1">
                  <div 
                    className={cn(
                      'flex flex-col items-center gap-2 flex-1',
                      (isActive || isPast) ? '' : 'opacity-40'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      isActive ? config.className : isPast ? 'bg-muted' : 'bg-muted/50'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>
                  {index < 2 && (
                    <div className={cn(
                      'h-0.5 flex-1 rounded-full',
                      isPast ? 'bg-primary' : 'bg-border'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default RequestDetailPage;
