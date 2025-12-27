import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Calendar } from '@/components/ui/calendar';
import { getEquipmentById, MaintenanceRequest } from '@/lib/data';
import { format, parseISO, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Clock, Calendar as CalendarIcon } from 'lucide-react';

export const MaintenanceCalendar = () => {
  const { requests } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get preventive maintenance requests
  const preventiveRequests = requests.filter(r => r.type === 'preventive');

  // Get dates with scheduled maintenance
  const scheduledDates = preventiveRequests.map(r => parseISO(r.scheduledDate));

  // Get requests for selected date
  const selectedDateRequests = selectedDate
    ? requests.filter(r => isSameDay(parseISO(r.scheduledDate), selectedDate))
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Preventive Maintenance Schedule
        </h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md pointer-events-auto"
          modifiers={{
            scheduled: scheduledDates,
          }}
          modifiersStyles={{
            scheduled: {
              backgroundColor: 'hsl(var(--primary) / 0.15)',
              color: 'hsl(var(--primary))',
              fontWeight: 600,
            },
          }}
        />
      </div>

      {/* Selected day details */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">
          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
        </h3>
        
        <AnimatePresence mode="wait">
          {selectedDateRequests.length > 0 ? (
            <motion.div
              key={selectedDate?.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {selectedDateRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground"
            >
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No maintenance scheduled</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RequestCard = ({ request }: { request: MaintenanceRequest }) => {
  const equipment = getEquipmentById(request.equipmentId);

  return (
    <div className="border border-border rounded-lg p-4 space-y-3 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm">{request.subject}</h4>
        <PriorityBadge priority={request.priority} />
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Wrench className="w-3.5 h-3.5" />
        <span>{equipment?.name}</span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>Duration: {request.duration}h</span>
      </div>
      
      <StatusBadge status={request.status} size="sm" />
    </div>
  );
};
