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

const ALL_VALUE = '__all__';

export interface EquipmentFilters {
  department: string;
  teamId: string;
  location: string;
  ownerType: string;
  status: string;
}

interface EquipmentFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: EquipmentFilters;
  onApplyFilters: (filters: EquipmentFilters) => void;
}

export const EquipmentFilterDialog = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: EquipmentFilterDialogProps) => {
  const { equipment, teams } = useData();
  const [localFilters, setLocalFilters] = useState<EquipmentFilters>(filters);

  // Get unique values from equipment data
  const departments = [...new Set(equipment.map((eq) => eq.department))];
  const locations = [...new Set(equipment.map((eq) => eq.location))];

  const toSelectValue = (val: string) => (val === '' ? ALL_VALUE : val);
  const fromSelectValue = (val: string) => (val === ALL_VALUE ? '' : val);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: EquipmentFilters = {
      department: '',
      teamId: '',
      location: '',
      ownerType: '',
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
          <DialogTitle>Filter Equipment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={toSelectValue(localFilters.department)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, department: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assigned Team</Label>
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
            <Label>Location</Label>
            <Select
              value={toSelectValue(localFilters.location)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, location: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ownership Type</Label>
            <Select
              value={toSelectValue(localFilters.ownerType)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, ownerType: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All ownership types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All ownership types</SelectItem>
                <SelectItem value="team">Team Owned</SelectItem>
                <SelectItem value="department">Department Owned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={toSelectValue(localFilters.status)}
              onValueChange={(v) =>
                setLocalFilters({ ...localFilters, status: fromSelectValue(v) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="scrapped">Scrapped</SelectItem>
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