import { MainLayout } from '@/components/layout/MainLayout';
import { TeamCard } from '@/components/teams/TeamCard';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { AddTeamDialog } from '@/components/dialogs/AddTeamDialog';

const TeamsPage = () => {
  const { teams } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTeams = teams.filter((team) => {
    const searchLower = search.toLowerCase();
    return (
      team.name.toLowerCase().includes(searchLower) ||
      team.description.toLowerCase().includes(searchLower) ||
      team.technicians.some((tech) => tech.name.toLowerCase().includes(searchLower))
    );
  });

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
          <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" />
            Add Team
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTeams.map((team, index) => (
            <TeamCard key={team.id} team={team} delay={index * 0.1} />
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No teams found</p>
          </motion.div>
        )}
      </div>

      <AddTeamDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </MainLayout>
  );
};

export default TeamsPage;
