import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TeamCard } from '@/components/teams/TeamCard';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { AddTeamDialog } from '@/components/dialogs/AddTeamDialog';
import { ViewMode } from '@/components/ui/ViewModeToggle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamsPage = () => {
  const { teams } = useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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
        <PageHeader
          icon={Users}
          title="Maintenance Teams"
          description="Manage your technicians and team assignments"
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search teams..."
          showViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addButtonLabel="Add Team"
          onAddClick={() => setShowAddDialog(true)}
        />

        {/* Teams Grid or List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeams.map((team, index) => (
              <TeamCard key={team.id} team={team} delay={index * 0.1} />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Technicians</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{team.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {team.technicians.slice(0, 4).map((tech) => (
                            <Avatar key={tech.id} className="w-7 h-7 border-2 border-background">
                              <AvatarImage src={tech.avatar} alt={tech.name} />
                              <AvatarFallback className="text-xs">
                                {tech.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {team.technicians.length} member{team.technicians.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

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
