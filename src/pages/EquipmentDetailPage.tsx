import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/contexts/DataContext';
import { getTeamById, getTechnicianById } from '@/lib/data';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings2, 
  MapPin, 
  Calendar, 
  User, 
  Users, 
  Wrench,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { KanbanCard } from '@/components/kanban/KanbanCard';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: { icon: CheckCircle, label: 'Active', className: 'text-emerald-600 bg-emerald-500/10' },
  maintenance: { icon: AlertCircle, label: 'Under Maintenance', className: 'text-amber-600 bg-amber-500/10' },
  scrapped: { icon: XCircle, label: 'Scrapped', className: 'text-red-600 bg-red-500/10' },
};

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipment, requests } = useData();

  const eq = equipment.find(e => e.id === id);
  
  if (!eq) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Equipment not found</p>
          <Button onClick={() => navigate('/equipment')} className="mt-4">
            Back to Equipment
          </Button>
        </div>
      </MainLayout>
    );
  }

  const team = getTeamById(eq.maintenanceTeamId);
  const defaultTech = getTechnicianById(eq.defaultTechnicianId);
  const equipmentRequests = requests.filter(r => r.equipmentId === eq.id);
  const openRequests = equipmentRequests.filter(r => r.status !== 'repaired' && r.status !== 'scrap');
  const statusInfo = statusConfig[eq.status];
  const StatusIcon = statusInfo.icon;

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
            onClick={() => navigate('/equipment')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Equipment
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
              <div className="p-4 rounded-xl bg-primary/10">
                <Settings2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{eq.name}</h1>
                <p className="text-muted-foreground font-mono">{eq.serialNumber}</p>
                <div className={cn('inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full', statusInfo.className)}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{statusInfo.label}</span>
                </div>
              </div>
            </div>

            {/* Smart Button */}
            <div className="flex flex-col items-end gap-2">
              <Button className="gap-2" onClick={() => navigate('/kanban')}>
                <Wrench className="w-4 h-4" />
                Maintenance
                {openRequests.length > 0 && (
                  <span className="ml-1 px-2.5 py-0.5 text-xs font-bold bg-primary-foreground text-primary rounded-full">
                    {openRequests.length}
                  </span>
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                {openRequests.length} open request{openRequests.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg">Equipment Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{eq.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Owner</p>
                  <p className="text-sm text-muted-foreground">{eq.owner}</p>
                  <p className="text-xs text-muted-foreground">{eq.department}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Purchase Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(eq.purchaseDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Warranty Expiry</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(eq.warrantyExpiry), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg">Assigned Team</h2>
            
            {team && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
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
                
                {defaultTech && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Default Technician
                    </p>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: team.color }}
                      >
                        {defaultTech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{defaultTech.name}</p>
                        <p className="text-xs text-muted-foreground">{defaultTech.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg">Maintenance History</h2>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {equipmentRequests.length > 0 ? (
                equipmentRequests.map((request) => (
                  <KanbanCard key={request.id} request={request} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No maintenance requests</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EquipmentDetailPage;
