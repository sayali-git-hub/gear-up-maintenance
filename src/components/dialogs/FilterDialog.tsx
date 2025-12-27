import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { MaintenanceStatus, MaintenanceType } from '@/lib/data';

const ALL_VALUE = '__all__';

export interface KanbanFilters {
  equipmentId: string;
  teamId: string;
  technicianId: string;
  type: MaintenanceType | '';
  priority: string;
  status: MaintenanceStatus | '';
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: KanbanFilters;
  onApplyFilters: (filters: KanbanFilters) => void;
}

export const FilterDialog = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: FilterDialogProps) => {
  const { equipment, teams } = useData();
  const [localFilters, setLocalFilters] = useState<KanbanFilters>(filters);

  const allTechnicians = teams.flatMap((t) => t.technicians);

  const toSelectValue = (val: string) => (val === '' ? ALL_VALUE : val);
  const fromSelectValue = (val: string) => (val === ALL_VALUE ? '' : val);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: KanbanFilters = {
      equipmentId: '',
      teamId: '',
      technicianId: '',
      type: '',
      priority: '',
      status: '',
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Requests</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Equipment</Label>
            <Select
              value={toSelectValue(localFilters.equipmentId)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, equipmentId: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All equipment</SelectItem>
                {equipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Maintenance Team</Label>
            <Select
              value={toSelectValue(localFilters.teamId)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, teamId: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Technician</Label>
            <Select
              value={toSelectValue(localFilters.technicianId)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, technicianId: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All technicians" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All technicians</SelectItem>
                {allTechnicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Request Type</Label>
            <Select
              value={toSelectValue(localFilters.type)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, type: fromSelectValue(v) as MaintenanceType | '' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All types</SelectItem>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={toSelectValue(localFilters.priority)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, priority: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={toSelectValue(localFilters.status)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, status: fromSelectValue(v) as MaintenanceStatus | '' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="repaired">Repaired</SelectItem>
                <SelectItem value="scrap">Scrap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};