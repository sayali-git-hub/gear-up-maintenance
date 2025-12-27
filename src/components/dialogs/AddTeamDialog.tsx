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
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Technician } from '@/lib/data';

interface AddTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorOptions = [
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const AddTeamDialog = ({
  open,
  onOpenChange,
}: AddTeamDialogProps) => {
  const { addTeam } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colorOptions[0],
  });
  const [technicians, setTechnicians] = useState<{ name: string; email: string }[]>([
    { name: '', email: '' },
  ]);

  const handleAddTechnician = () => {
    setTechnicians([...technicians, { name: '', email: '' }]);
  };

  const handleRemoveTechnician = (index: number) => {
    if (technicians.length > 1) {
      setTechnicians(technicians.filter((_, i) => i !== index));
    }
  };

  const handleTechnicianChange = (
    index: number,
    field: 'name' | 'email',
    value: string
  ) => {
    const updated = [...technicians];
    updated[index][field] = value;
    setTechnicians(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Please enter a team name');
      return;
    }

    const validTechnicians = technicians.filter((t) => t.name && t.email);

    addTeam({
      name: formData.name,
      description: formData.description || 'No description',
      color: formData.color,
      technicians: validTechnicians.map((t, index) => ({
        id: `tech-new-${Date.now()}-${index}`,
        name: t.name,
        email: t.email,
        avatar: '',
        teamId: '', // Will be set by addTeam
      })),
    });

    toast.success('Team created successfully');
    setFormData({ name: '', description: '', color: colorOptions[0] });
    setTechnicians([{ name: '', email: '' }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Mechanics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Team responsibilities and expertise"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Team Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-primary'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Technicians</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTechnician}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {technicians.map((tech, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Name"
                      value={tech.name}
                      onChange={(e) =>
                        handleTechnicianChange(index, 'name', e.target.value)
                      }
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={tech.email}
                      onChange={(e) =>
                        handleTechnicianChange(index, 'email', e.target.value)
                      }
                    />
                  </div>
                  {technicians.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleRemoveTechnician(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
