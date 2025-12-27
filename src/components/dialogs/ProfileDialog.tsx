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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog = ({
  open,
  onOpenChange,
}: ProfileDialogProps) => {
  const { teams, userProfile, updateUserProfile } = useData();
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    role: userProfile.role,
    teamId: userProfile.teamId,
    phone: userProfile.phone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    updateUserProfile({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      teamId: formData.teamId,
      phone: formData.phone,
    });

    toast.success('Profile updated successfully');
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex justify-center mb-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {formData.name ? getInitials(formData.name) : <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@gearguard.io"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(v) =>
                setFormData({ ...formData, role: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assigned Team</Label>
            <Select
              value={formData.teamId}
              onValueChange={(v) =>
                setFormData({ ...formData, teamId: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="No team assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No team assigned</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
