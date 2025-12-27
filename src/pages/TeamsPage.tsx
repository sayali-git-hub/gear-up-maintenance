import { MainLayout } from '@/components/layout/MainLayout';
import { TeamCard } from '@/components/teams/TeamCard';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeamsPage = () => {
  const { teams } = useData();

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Maintenance Teams</h1>
              <p className="text-sm text-muted-foreground">
                Manage your technicians and team assignments
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Team
          </Button>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <TeamCard key={team.id} team={team} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamsPage;
