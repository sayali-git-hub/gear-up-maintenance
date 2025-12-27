import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { MaintenanceTeam } from '@/lib/data';
import { toast } from 'sonner';

interface AddTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: MaintenanceTeam;
}

export const AddTechnicianDialog = ({
  open,
  onOpenChange,
  team,
}: AddTechnicianDialogProps) => {
  const { addTechnicianToTeam } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Technician name is required');
      return;
    }

    addTechnicianToTeam(team.id, { name: name.trim(), email: email.trim() });
    toast.success(`${name} added to ${team.name}`);
    
    // Reset form
    setName('');
    setEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Technician to {team.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tech-name">Name *</Label>
            <Input
              id="tech-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter technician name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech-email">Email</Label>
            <Input
              id="tech-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Technician</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
