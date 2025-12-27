import { MaintenanceTeam } from '@/lib/data';
import { useData } from '@/contexts/DataContext';
import { Users, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamCardProps {
  team: MaintenanceTeam;
  delay?: number;
}

export const TeamCard = ({ team, delay = 0 }: TeamCardProps) => {
  const { equipment, requests } = useData();
  
  const teamEquipment = equipment.filter(e => e.maintenanceTeamId === team.id);
  const teamRequests = requests.filter(r => {
    const eq = equipment.find(e => e.id === r.equipmentId);
    return eq?.maintenanceTeamId === team.id;
  });
  const activeRequests = teamRequests.filter(r => r.status === 'in_progress').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/30"
    >
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${team.color}20` }}
        >
          <Wrench className="w-6 h-6" style={{ color: team.color }} />
        </div>
        <div>
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
          <p className="text-xs text-muted-foreground">Equipment</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: team.color }}>{activeRequests}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
      </div>

      {/* Technicians */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Team Members</span>
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
  );
};
