import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Settings2, 
  Wrench, 
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { requests, equipment } = useData();
  const navigate = useNavigate();

  const stats = {
    totalEquipment: equipment.length,
    activeEquipment: equipment.filter(e => e.status === 'active').length,
    openRequests: requests.filter(r => r.status === 'new' || r.status === 'in_progress').length,
    completedRequests: requests.filter(r => r.status === 'repaired').length,
  };

  const handleTotalEquipmentClick = () => {
    navigate('/equipment');
  };

  const handleOpenRequestsClick = () => {
    navigate('/kanban?filter=open');
  };

  const handleCompletedRequestsClick = () => {
    navigate('/kanban?filter=completed');
  };

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
            Open Requests
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Stats Grid - Only 3 cards now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={handleTotalEquipmentClick} className="text-left">
            <StatCard
              title="Total Equipments"
              value={stats.totalEquipment}
              subtitle={`${stats.activeEquipment} active`}
              icon={Settings2}
              color="blue"
              delay={0}
            />
          </button>
          <button onClick={handleOpenRequestsClick} className="text-left">
            <StatCard
              title="Open Requests"
              value={stats.openRequests}
              subtitle="New & In Progress"
              icon={Wrench}
              color="orange"
              delay={0.1}
            />
          </button>
          <button onClick={handleCompletedRequestsClick} className="text-left">
            <StatCard
              title="Completed Requests"
              value={stats.completedRequests}
              subtitle="Repaired"
              icon={CheckCircle}
              color="green"
              delay={0.2}
            />
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
