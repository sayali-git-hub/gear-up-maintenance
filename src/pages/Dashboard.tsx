import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { KanbanCard } from '@/components/kanban/KanbanCard';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Settings2, 
  Wrench, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isPast, parseISO } from 'date-fns';
import { useState } from 'react';
import { CriticalRequestsDialog } from '@/components/dialogs/CriticalRequestsDialog';

const Dashboard = () => {
  const { requests, equipment, teams } = useData();
  const navigate = useNavigate();
  const [showCriticalDialog, setShowCriticalDialog] = useState(false);

  const stats = {
    totalEquipment: equipment.length,
    activeEquipment: equipment.filter(e => e.status === 'active').length,
    openRequests: requests.filter(r => r.status !== 'repaired' && r.status !== 'scrap').length,
    completedThisMonth: requests.filter(r => r.status === 'repaired').length,
    overdueRequests: requests.filter(r => 
      r.status !== 'repaired' && 
      r.status !== 'scrap' && 
      isPast(parseISO(r.scheduledDate))
    ).length,
    criticalRequests: requests.filter(r => r.priority === 'critical' && r.status !== 'repaired').length,
  };

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to <span className="gradient-text">GearGuard</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your maintenance operations
            </p>
          </div>
          <Button 
            onClick={() => navigate('/kanban')} 
            className="gap-2 glow-primary"
          >
            Open Kanban Board
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Equipment"
            value={stats.totalEquipment}
            subtitle={`${stats.activeEquipment} active`}
            icon={Settings2}
            color="blue"
            delay={0}
          />
          <StatCard
            title="Open Requests"
            value={stats.openRequests}
            icon={Wrench}
            color="orange"
            trend={{ value: 12, positive: false }}
            delay={0.1}
          />
          <StatCard
            title="Completed"
            value={stats.completedThisMonth}
            subtitle="This month"
            icon={CheckCircle}
            color="green"
            trend={{ value: 24, positive: true }}
            delay={0.2}
          />
          <StatCard
            title="Overdue"
            value={stats.overdueRequests}
            icon={AlertTriangle}
            color="red"
            delay={0.3}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Requests
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/kanban')}>
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentRequests.map((request) => (
                <KanbanCard key={request.id} request={request} />
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            {/* Critical Alert */}
            {stats.criticalRequests > 0 && (
              <button
                onClick={() => setShowCriticalDialog(true)}
                className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 hover:bg-red-500/20 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      {stats.criticalRequests} Critical
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click to view critical requests
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Overdue Alert */}
            {stats.overdueRequests > 0 && (
              <button
                onClick={() => setShowCriticalDialog(true)}
                className="w-full bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 hover:bg-orange-500/20 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400">
                      {stats.overdueRequests} Overdue
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click to view overdue requests
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Teams Overview */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Teams Overview
              </h3>
              <div className="space-y-3">
                {teams.map((team) => {
                  const teamRequests = requests.filter(r => {
                    const eq = equipment.find(e => e.id === r.equipmentId);
                    return eq?.maintenanceTeamId === team.id && r.status === 'in_progress';
                  }).length;
                  
                  return (
                    <div 
                      key={team.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="font-medium text-sm">{team.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {teamRequests} active
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CriticalRequestsDialog
        open={showCriticalDialog}
        onOpenChange={setShowCriticalDialog}
      />
    </MainLayout>
  );
};

export default Dashboard;
