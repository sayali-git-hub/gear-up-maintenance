import { MaintenanceTeam } from '@/lib/data';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Users, Wrench, UserPlus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AddTechnicianDialog } from '@/components/dialogs/AddTechnicianDialog';
import { cn } from '@/lib/utils';

interface TeamCardProps {
  team: MaintenanceTeam;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const { equipment, requests } = useData();
  const navigate = useNavigate();
  const [showAddTechDialog, setShowAddTechDialog] = useState(false);
  
  const teamEquipment = equipment.filter(e => e.maintenanceTeamId === team.id);
  const teamRequests = requests.filter(r => r.teamId === team.id);
  const activeRequests = teamRequests.filter(r => r.status === 'in_progress').length;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the add technician button
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/teams/${team.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={cn(
          'bg-card border border-border rounded-xl p-6 cursor-pointer group',
          'transition-all duration-200 hover:shadow-lg hover:border-primary/30',
          'hover:-translate-y-0.5'
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${team.color}15` }}
          >
            <Wrench className="w-6 h-6" style={{ color: team.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {team.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{team.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5 py-4 border-y border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">{team.technicians.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Technicians</p>
          </div>
          <div className="text-center border-x border-border/50">
            <p className="text-2xl font-bold tracking-tight">{teamEquipment.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Equipment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight" style={{ color: activeRequests > 0 ? team.color : undefined }}>
              {activeRequests}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Active</p>
          </div>
        </div>

        {/* Technicians */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Team Members</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddTechDialog(true);
              }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {team.technicians.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No technicians assigned</p>
            ) : (
              team.technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50 transition-colors hover:bg-muted"
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm"
                    style={{ backgroundColor: team.color }}
                  >
                    {tech.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddTechnicianDialog
        open={showAddTechDialog}
        onOpenChange={setShowAddTechDialog}
        team={team}
      />
    </>
  );
};
