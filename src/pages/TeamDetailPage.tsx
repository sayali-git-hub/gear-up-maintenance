import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/contexts/DataContext';
import { getEquipmentById } from '@/lib/data';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  Mail,
  Wrench,
  Settings2,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams, requests, equipment } = useData();

  const team = teams.find(t => t.id === id);

  if (!team) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Team not found</p>
          <Button onClick={() => navigate('/teams')} className="mt-4">
            Back to Teams
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Get equipment assigned to this team
  const teamEquipment = equipment.filter(e => e.maintenanceTeamId === team.id);
  
  // Get requests for this team's equipment
  const teamRequests = requests.filter(r => {
    const eq = getEquipmentById(r.equipmentId);
    return eq?.maintenanceTeamId === team.id;
  });

  const openRequests = teamRequests.filter(r => r.status === 'new' || r.status === 'in_progress');

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
            onClick={() => navigate('/teams')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${team.color}20` }}
              >
                <Users className="w-8 h-8" style={{ color: team.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {team.id.toUpperCase()}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
                <p className="text-muted-foreground mt-1">{team.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {team.technicians.length} technicians
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings2 className="w-4 h-4" />
                    {teamEquipment.length} equipment
                  </span>
                  <span className="flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" />
                    {openRequests.length} open requests
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Technicians */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Members
            </h2>
            
            <div className="space-y-3">
              {team.technicians.map((tech) => {
                const techRequests = requests.filter(
                  r => r.assignedTechnicianId === tech.id && 
                  (r.status === 'new' || r.status === 'in_progress')
                );
                
                return (
                  <div 
                    key={tech.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                      style={{ backgroundColor: team.color }}
                    >
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{tech.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {tech.email}
                      </div>
                    </div>
                    {techRequests.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {techRequests.length} active
                      </Badge>
                    )}
                  </div>
                );
              })}
              
              {team.technicians.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No technicians in this team</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Assigned Equipment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Assigned Equipment
            </h2>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {teamEquipment.map((eq) => (
                <div 
                  key={eq.id}
                  onClick={() => navigate(`/equipment/${eq.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{eq.name}</p>
                    <p className="text-xs text-muted-foreground">{eq.location}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      eq.status === 'active' ? 'text-emerald-600 border-emerald-200' :
                      eq.status === 'maintenance' ? 'text-amber-600 border-amber-200' :
                      'text-red-600 border-red-200'
                    }
                  >
                    {eq.status}
                  </Badge>
                </div>
              ))}
              
              {teamEquipment.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No equipment assigned</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Active Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Active Requests
            </h2>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {openRequests.map((request) => {
                const eq = getEquipmentById(request.equipmentId);
                
                return (
                  <div 
                    key={request.id}
                    onClick={() => navigate(`/requests/${request.id}`)}
                    className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="outline" className="font-mono text-xs mb-1">
                          {request.id.toUpperCase()}
                        </Badge>
                        <p className="font-medium text-sm">{request.subject}</p>
                        <p className="text-xs text-muted-foreground">{eq?.name}</p>
                      </div>
                      <PriorityBadge priority={request.priority} />
                    </div>
                    <StatusBadge status={request.status} size="sm" />
                  </div>
                );
              })}
              
              {openRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active requests</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamDetailPage;
