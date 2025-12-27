import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TeamCard } from '@/components/teams/TeamCard';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import { useState } from 'react';
import { AddTeamDialog } from '@/components/dialogs/AddTeamDialog';
import { ViewMode } from '@/components/ui/ViewModeToggle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

const TeamsPage = () => {
  const { teams } = useData();
  const navigate = useNavigate();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        <PageHeader
          icon={Users}
          title="Maintenance Teams"
          description="Manage your technicians and team assignments"
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search teams or technicians..."
          showViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addButtonLabel="Add Team"
          onAddClick={() => setShowAddDialog(true)}
        />

        {/* Empty state */}
        {filteredTeams.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? 'No teams found' : 'No teams yet'}
            description={
              search 
                ? `No teams match "${search}". Try a different search term.`
                : 'Create your first maintenance team to organize technicians and assign them to equipment.'
            }
            actionLabel={search ? undefined : 'Create Team'}
            onAction={search ? undefined : () => setShowAddDialog(true)}
          />
        ) : viewMode === 'grid' ? (
          /* Teams Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredTeams.map((team) => (
              <motion.div key={team.id} variants={itemVariants}>
                <TeamCard team={team} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Teams Table */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl overflow-hidden bg-card"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">Team</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Technicians</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow 
                    key={team.id} 
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {team.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {team.technicians.slice(0, 4).map((tech) => (
                            <Avatar key={tech.id} className="w-7 h-7 border-2 border-background ring-0">
                              <AvatarImage src={tech.avatar} alt={tech.name} />
                              <AvatarFallback 
                                className="text-xs text-white"
                                style={{ backgroundColor: team.color }}
                              >
                                {tech.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {team.technicians.length > 4 && (
                            <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                +{team.technicians.length - 4}
                              </span>
                            </div>
                          )}
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
