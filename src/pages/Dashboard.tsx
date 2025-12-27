import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RequestsTable } from '@/components/dashboard/RequestsTable';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ViewMode } from '@/components/ui/ViewModeToggle';
import { CreateRequestDialog } from '@/components/dialogs/CreateRequestDialog';
import { AlertTriangle, Users, ClipboardList, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const sortedRequests = [...filteredRequests]
    .sort((a, b) => {
      const aComplete = a.status === 'repaired' || a.status === 'scrap';
      const bComplete = b.status === 'repaired' || b.status === 'scrap';
      if (aComplete !== bComplete) return aComplete ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 12);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          icon={LayoutDashboard}
          title="Dashboard"
          description="Maintenance operations overview"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search requests..."
          showViewToggle={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addButtonLabel="New Request"
          onAddClick={() => setShowCreateDialog(true)}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="Critical Equipment"
            value={criticalEquipment}
            subtitle={`${equipment.length} total`}
            icon={AlertTriangle}
            variant="critical"
            onClick={() => navigate('/equipment?filter=critical')}
          />
          <InsightCard
            title="Technician Load"
            value={`${utilizationPercent}%`}
            subtitle={`${totalTechnicians - assignedTechnicians} available`}
            icon={Users}
            variant="info"
            onClick={() => navigate('/teams')}
          />
          <InsightCard
            title="Open Requests"
            value={openRequests}
            subtitle={overdueRequests > 0 ? `${overdueRequests} overdue` : 'All on schedule'}
            icon={ClipboardList}
            variant="success"
            onClick={() => navigate('/kanban')}
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'new', label: 'New', count: statusCounts.new, color: 'bg-info' },
            { key: 'in_progress', label: 'In Progress', count: statusCounts.in_progress, color: 'bg-warning' },
            { key: 'repaired', label: 'Repaired', count: statusCounts.repaired, color: 'bg-success' },
            { key: 'scrap', label: 'Scrap', count: statusCounts.scrap, color: 'bg-destructive' },
          ].map((item) => (
            <button 
              key={item.key}
              onClick={() => navigate(`/kanban?stage=${item.key}`)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border hover:border-primary/40 transition-colors text-sm"
            >
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-foreground">{item.count}</span>
            </button>
          ))}
        </div>

        {/* Requests */}
        {viewMode === 'grid' ? (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Requests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedRequests.map((request, index) => (
                <DashboardCard key={request.id} request={request} index={index} />
              ))}
            </div>
          </div>
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
