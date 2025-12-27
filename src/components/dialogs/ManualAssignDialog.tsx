import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { Users, User } from 'lucide-react';

interface ManualAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTeamId: string | null;
  currentTechnicianId: string | null;
  onAssign: (teamId: string, technicianId: string) => void;
}

export function ManualAssignDialog({
  open,
  onOpenChange,
  currentTeamId,
  currentTechnicianId,
  onAssign,
}: ManualAssignDialogProps) {
  const { teams } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(currentTeamId || '');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>(currentTechnicianId || '');

  useEffect(() => {
    if (open) {
      setSelectedTeamId(currentTeamId || '');
      setSelectedTechnicianId(currentTechnicianId || '');
    }
  }, [open, currentTeamId, currentTechnicianId]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const technicians = selectedTeam?.technicians || [];

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedTechnicianId('');
  };

  const handleSubmit = () => {
    if (selectedTeamId && selectedTechnicianId) {
      onAssign(selectedTeamId, selectedTechnicianId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Manual Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team">Maintenance Team</Label>
            <Select value={selectedTeamId} onValueChange={handleTeamChange}>
              <SelectTrigger id="team">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      <span>{team.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician">Technician</Label>
            <Select
              value={selectedTechnicianId}
              onValueChange={setSelectedTechnicianId}
              disabled={!selectedTeamId}
            >
              <SelectTrigger id="technician">
                <SelectValue placeholder={selectedTeamId ? "Select a technician" : "Select a team first"} />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{tech.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTeamId || !selectedTechnicianId}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
