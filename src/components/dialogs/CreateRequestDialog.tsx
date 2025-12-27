import { useState, useEffect, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { MaintenanceType } from '@/lib/data';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  defaultType?: MaintenanceType;
}

export const CreateRequestDialog = ({ 
  open, 
  onOpenChange, 
  defaultDate,
  defaultType = 'corrective',
}: CreateRequestDialogProps) => {
  const { equipment, teams, addRequest } = useData();
  
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [type, setType] = useState<MaintenanceType>(defaultType);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [duration, setDuration] = useState('4');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(defaultDate);
  const [teamId, setTeamId] = useState('');
  const [technicianId, setTechnicianId] = useState('');

  // Update state when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      if (defaultDate) setScheduledDate(defaultDate);
      if (defaultType) setType(defaultType);
    }
  }, [open, defaultDate, defaultType]);

  // Get technicians for the selected team
  const selectedTeam = useMemo(() => {
    return teams.find(t => t.id === teamId);
  }, [teams, teamId]);

  const availableTechnicians = useMemo(() => {
    return selectedTeam?.technicians || [];
  }, [selectedTeam]);

  // Reset technician when team changes
  useEffect(() => {
    setTechnicianId('');
  }, [teamId]);

  // Auto-fill team based on selected equipment
  useEffect(() => {
    if (equipmentId) {
      const selectedEquipment = equipment.find(e => e.id === equipmentId);
      if (selectedEquipment && !teamId) {
        setTeamId(selectedEquipment.maintenanceTeamId);
      }
    }
  }, [equipmentId, equipment, teamId]);

  const handleSubmit = () => {
    if (!subject || !equipmentId || !scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addRequest({
      subject,
      description,
      equipmentId,
      type,
      status: 'new',
      scheduledDate: format(scheduledDate, 'yyyy-MM-dd'),
      duration: parseInt(duration),
      teamId: teamId || null,
      assignedTechnicianId: technicianId || null,
      timeSpent: 0,
      priority,
    });

    toast.success('Maintenance request created successfully!');
    onOpenChange(false);
    
    // Reset form
    setSubject('');
    setDescription('');
    setEquipmentId('');
    setType('corrective');
    setPriority('medium');
    setDuration('4');
    setScheduledDate(undefined);
    setTeamId('');
    setTechnicianId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Create Maintenance Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Brief description of the issue..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <Label>Equipment *</Label>
            <Select value={equipmentId} onValueChange={setEquipmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.filter(e => e.status !== 'scrapped').map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} ({eq.serialNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team and Technician */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Maintenance Team</Label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: team.color }}
                        />
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Technician</Label>
              <Select 
                value={technicianId} 
                onValueChange={setTechnicianId}
                disabled={!teamId || availableTechnicians.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!teamId ? "Select team first" : "Select technician"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTechnicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as MaintenanceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">Corrective (Breakdown)</SelectItem>
                  <SelectItem value="preventive">Preventive (Routine)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the maintenance required..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Request</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
