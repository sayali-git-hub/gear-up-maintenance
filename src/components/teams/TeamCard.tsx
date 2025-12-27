import { MaintenanceTeam } from '@/lib/data';
import { useData } from '@/contexts/DataContext';
import { Users, Wrench, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddTechnicianDialog } from '@/components/dialogs/AddTechnicianDialog';

interface TeamCardProps {
  team: MaintenanceTeam;
  delay?: number;
}

export const TeamCard = ({ team, delay = 0 }: TeamCardProps) => {
  const { equipment, requests } = useData();
  const navigate = useNavigate();
  const [showAddTechDialog, setShowAddTechDialog] = useState(false);
  
  const teamEquipment = equipment.filter(e => e.maintenanceTeamId === team.id);
  const teamRequests = requests.filter(r => {
    const eq = equipment.find(e => e.id === r.equipmentId);
    return eq?.maintenanceTeamId === team.id;
  });
  const activeRequests = teamRequests.filter(r => r.status === 'in_progress').length;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the add technician button
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/teams/${team.id}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        onClick={handleCardClick}
        className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/30 cursor-pointer"
      >
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${team.color}20` }}
          >
            <Wrench className="w-6 h-6" style={{ color: team.color }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{team.name}</h3>
            <p className="text-sm text-muted-foreground">{team.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-border">
          <div className="text-center">
            <p className="text-2xl font-bold">{team.technicians.length}</p>
            <p className="text-xs text-muted-foreground">Technicians</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{teamEquipment.length}</p>
            <p className="text-xs text-muted-foreground">Equipments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: team.color }}>{activeRequests}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>

        {/* Technicians */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Team Members</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 px-2 text-xs"
              onClick={() => setShowAddTechDialog(true)}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Technician
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {team.technicians.map((tech) => (
              <div
                key={tech.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: team.color }}
                >
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AddTechnicianDialog
        open={showAddTechDialog}
        onOpenChange={setShowAddTechDialog}
        team={team}
      />
    </>
  );
};
