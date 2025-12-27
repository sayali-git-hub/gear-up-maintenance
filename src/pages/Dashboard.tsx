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
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

  // Request status counts
  const statusCounts = {
    new: requests.filter(r => r.status === 'new').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    repaired: requests.filter(r => r.status === 'repaired').length,
    scrap: requests.filter(r => r.status === 'scrap').length,
  };

  // Filter requests
  const filteredRequests = requests.filter(r => 
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort requests
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
          searchPlaceholder="Search requests..."
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addButtonLabel="New Request"
          onAddClick={() => setShowCreateDialog(true)}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="Critical Equipment"
            value={criticalEquipment}
            subtitle={`${equipment.length} total assets tracked`}
            icon={AlertTriangle}
            variant={criticalEquipment > 0 ? 'critical' : 'neutral'}
            delay={0}
            onClick={() => navigate('/equipment?filter=critical')}
          />
          <InsightCard
            title="Team Utilization"
            value={`${utilizationPercent}%`}
            subtitle={utilizationPercent > 80 
              ? 'High workload - consider rebalancing' 
              : `${totalTechnicians - assignedTechnicians} technicians available`
            }
            icon={Users}
            variant={utilizationPercent > 80 ? 'warning' : 'info'}
            delay={0.05}
            onClick={() => navigate('/teams')}
          />
          <InsightCard
            title="Open Requests"
            value={openRequests}
            subtitle={overdueRequests > 0 
              ? `${overdueRequests} overdue - attention needed` 
              : 'All requests on schedule'
            }
            icon={ClipboardList}
            variant={overdueRequests > 0 ? 'warning' : 'success'}
            delay={0.1}
            onClick={() => navigate('/kanban?filter=open')}
          />
        </div>

        {/* Workflow Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-5"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Request Pipeline</h3>
            <button 
              onClick={() => navigate('/kanban')}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'new', label: 'New', count: statusCounts.new, color: 'bg-primary' },
              { key: 'in_progress', label: 'In Progress', count: statusCounts.in_progress, color: 'bg-amber-500' },
              { key: 'repaired', label: 'Completed', count: statusCounts.repaired, color: 'bg-emerald-500' },
              { key: 'scrap', label: 'Scrapped', count: statusCounts.scrap, color: 'bg-red-500' },
            ].map((status) => (
              <button 
                key={status.key}
                onClick={() => navigate(`/kanban?stage=${status.key}`)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-100"
              >
                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                <span className="text-sm text-foreground">{status.label}</span>
                <span className="text-sm font-medium text-muted-foreground">{status.count}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Recent Requests</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedRequests.map((request, index) => (
                  <DashboardCard key={request.id} request={request} index={index} />
                ))}
              </div>
            </>
          ) : (
            <RequestsTable />
          )}
        </motion.div>
      </div>

      <CreateRequestDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </MainLayout>
  );
};

export default Dashboard;
