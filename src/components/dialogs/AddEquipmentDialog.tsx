import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface AddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddEquipmentDialog = ({
  open,
  onOpenChange,
}: AddEquipmentDialogProps) => {
  const { teams, addEquipment } = useData();
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    department: '',
    owner: '',
    location: '',
    purchaseDate: '',
    warrantyExpiry: '',
    maintenanceTeamId: '',
    defaultTechnicianId: '',
  });

  const selectedTeam = teams.find((t) => t.id === formData.maintenanceTeamId);
  const technicians = selectedTeam?.technicians || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.serialNumber || !formData.maintenanceTeamId) {
      toast.error('Please fill in all required fields');
      return;
    }

    addEquipment({
      name: formData.name,
      serialNumber: formData.serialNumber,
      department: formData.department || 'General',
      owner: formData.owner || 'Unassigned',
      location: formData.location || 'TBD',
      purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
      warrantyExpiry: formData.warrantyExpiry || '',
      maintenanceTeamId: formData.maintenanceTeamId,
      defaultTechnicianId: formData.defaultTechnicianId || technicians[0]?.id || '',
      status: 'active',
      image: '',
    });

    toast.success('Equipment added successfully');
    setFormData({
      name: '',
      serialNumber: '',
      department: '',
      owner: '',
      location: '',
      purchaseDate: '',
      warrantyExpiry: '',
      maintenanceTeamId: '',
      defaultTechnicianId: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="CNC Machine"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                placeholder="SN-2024-001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="Manufacturing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
                placeholder="Production Team"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Building A - Floor 2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) =>
                  setFormData({ ...formData, warrantyExpiry: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assigned Team *</Label>
            <Select
              value={formData.maintenanceTeamId}
              onValueChange={(v) =>
                setFormData({ ...formData, maintenanceTeamId: v, defaultTechnicianId: '' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.maintenanceTeamId && (
            <div className="space-y-2">
              <Label>Default Technician</Label>
              <Select
                value={formData.defaultTechnicianId}
                onValueChange={(v) =>
                  setFormData({ ...formData, defaultTechnicianId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Equipment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
