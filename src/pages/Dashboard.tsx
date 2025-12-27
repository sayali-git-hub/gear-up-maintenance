import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RequestsTable } from '@/components/dashboard/RequestsTable';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ViewMode } from '@/components/ui/ViewModeToggle';
import { CreateRequestDialog } from '@/components/dialogs/CreateRequestDialog';
import { 
  AlertTriangle, 
  Users, 
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { requests, equipment, teams } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Calculate stats
  const criticalEquipment = equipment.filter(e => e.status === 'maintenance' || e.status === 'scrapped').length;
  const openRequests = requests.filter(r => r.status === 'new' || r.status === 'in_progress').length;
  const overdueRequests = requests.filter(r => {
    const scheduled = new Date(r.scheduledDate);
    return (r.status === 'new' || r.status === 'in_progress') && scheduled < new Date();
  }).length;
  
  // Calculate technician utilization
  const totalTechnicians = teams.reduce((acc, team) => acc + team.technicians.length, 0);
  const assignedTechnicians = new Set(
    requests
      .filter(r => r.status === 'in_progress' && r.assignedTechnicianId)
      .map(r => r.assignedTechnicianId)
  ).size;
  const utilizationPercent = totalTechnicians > 0 
    ? Math.round((assignedTechnicians / totalTechnicians) * 100) 
    : 0;

  // Request status counts for workflow visibility
  const statusCounts = {
    new: requests.filter(r => r.status === 'new').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    repaired: requests.filter(r => r.status === 'repaired').length,
    scrap: requests.filter(r => r.status === 'scrap').length,
  };

  // Filter requests based on search
  const filteredRequests = requests.filter(r => 
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort requests: non-completed first, then by date
  const sortedRequests = [...filteredRequests]
    .sort((a, b) => {
      const aComplete = a.status === 'repaired' || a.status === 'scrap';
      const bComplete = b.status === 'repaired' || b.status === 'scrap';
      if (aComplete !== bComplete) return aComplete ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 12);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <PageHeader
          icon={LayoutDashboard}
          title="Dashboard"
          description="Maintenance operations overview"
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          searchPlaceholder="Search maintenance requests..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addButtonLabel="Add"
          onAddClick={() => setShowCreateDialog(true)}
        />

        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="Critical Equipment"
            value={criticalEquipment}
            subtitle={`${equipment.length} total equipment`}
            icon={AlertTriangle}
            variant="critical"
            delay={0}
            onClick={() => navigate('/equipment?filter=critical')}
          />
          <InsightCard
            title="Technician Load"
            value={`${utilizationPercent}% Utilized`}
            subtitle={utilizationPercent > 80 ? 'Assign Carefully' : `${totalTechnicians - assignedTechnicians} available`}
            icon={Users}
            variant="info"
            delay={0.1}
            onClick={() => navigate('/teams')}
          />
          <InsightCard
            title="Open Requests"
            value={openRequests}
            subtitle={overdueRequests > 0 ? `${overdueRequests} overdue` : 'All on schedule'}
            icon={ClipboardList}
            variant="success"
            delay={0.2}
            onClick={() => navigate('/kanban?filter=open')}
          />
        </div>

        {/* Workflow Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-xl border bg-card p-4"
        >
          <h3 className="font-semibold mb-4">Request Workflow Status</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/kanban?stage=new')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-medium">New</span>
              <Badge variant="secondary">{statusCounts.new}</Badge>
            </button>
            <button 
              onClick={() => navigate('/kanban?stage=in_progress')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="font-medium">In Progress</span>
              <Badge variant="secondary">{statusCounts.in_progress}</Badge>
            </button>
            <button 
              onClick={() => navigate('/kanban?stage=repaired')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-medium">Repaired</span>
              <Badge variant="secondary">{statusCounts.repaired}</Badge>
            </button>
            <button 
              onClick={() => navigate('/kanban?stage=scrap')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-medium">Scrap</span>
              <Badge variant="secondary">{statusCounts.scrap}</Badge>
            </button>
          </div>
        </motion.div>

        {/* Requests - Grid or Table View */}
        {viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Recent Maintenance Requests</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedRequests.map((request, index) => (
                <DashboardCard key={request.id} request={request} index={index} />
              ))}
            </div>
          </motion.div>
        ) : (
          <RequestsTable />
        )}
      </div>

      <CreateRequestDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </MainLayout>
  );
};

export default Dashboard;
