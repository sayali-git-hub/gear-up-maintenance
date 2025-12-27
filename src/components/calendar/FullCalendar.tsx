import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { getEquipmentById, getTechnicianById, MaintenanceRequest } from '@/lib/data';
import { 
  format, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  addWeeks,
  subMonths,
  subWeeks,
  subDays,
  isSameMonth, 
  isSameDay,
  isToday,
  startOfDay,
  endOfDay,
  eachHourOfInterval,
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CreateRequestDialog } from '@/components/dialogs/CreateRequestDialog';
import { PriorityBadge } from '@/components/ui/PriorityBadge';

type ViewMode = 'month' | 'week' | 'day';

const priorityColors = {
  low: 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300',
  medium: 'bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300',
  high: 'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:text-orange-300',
  critical: 'bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300',
};

export const FullCalendar = () => {
  const { requests } = useData();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
        break;
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const getRequestsForDate = (date: Date) => {
    return requests.filter(r => isSameDay(parseISO(r.scheduledDate), date));
  };

  const handleEventClick = (request: MaintenanceRequest) => {
    navigate(`/requests/${request.id}`);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowCreateDialog(true);
  };

  const getHeaderText = () => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <h2 className="text-lg font-semibold ml-2">{getHeaderText()}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-lg p-1">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 px-3 capitalize',
                    viewMode === mode && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </Button>
              ))}
            </div>
            <Button size="sm" className="gap-1" onClick={() => {
              setSelectedDate(new Date());
              setShowCreateDialog(true);
            }}>
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Calendar Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${currentDate.toISOString()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'month' && (
              <MonthView 
                currentDate={currentDate} 
                requests={requests}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}
            {viewMode === 'week' && (
              <WeekView 
                currentDate={currentDate} 
                requests={requests}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}
            {viewMode === 'day' && (
              <DayView 
                currentDate={currentDate} 
                requests={requests}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <CreateRequestDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        defaultDate={selectedDate}
      />
    </>
  );
};

// Month View Component
const MonthView = ({ 
  currentDate, 
  requests, 
  onEventClick,
  onDateClick
}: { 
  currentDate: Date;
  requests: MaintenanceRequest[];
  onEventClick: (request: MaintenanceRequest) => void;
  onDateClick: (date: Date) => void;
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-7">
      {/* Week day headers */}
      {weekDays.map((dayName) => (
        <div 
          key={dayName} 
          className="p-2 text-center text-sm font-medium text-muted-foreground border-b border-border"
        >
          {dayName}
        </div>
      ))}
      
      {/* Calendar days */}
      {days.map((day, index) => {
        const dayRequests = requests.filter(r => isSameDay(parseISO(r.scheduledDate), day));
        const isCurrentMonth = isSameMonth(day, currentDate);
        
        return (
          <div
            key={index}
            className={cn(
              'min-h-[120px] p-2 border-b border-r border-border cursor-pointer hover:bg-muted/50 transition-colors',
              !isCurrentMonth && 'bg-muted/20',
              index % 7 === 0 && 'border-l'
            )}
            onClick={() => onDateClick(day)}
          >
            <div className={cn(
              'text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full',
              isToday(day) && 'bg-primary text-primary-foreground',
              !isCurrentMonth && 'text-muted-foreground'
            )}>
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {dayRequests.slice(0, 3).map((request) => (
                <div
                  key={request.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(request);
                  }}
                  className={cn(
                    'text-xs p-1 rounded truncate cursor-pointer border',
                    priorityColors[request.priority]
                  )}
                >
                  {request.subject}
                </div>
              ))}
              {dayRequests.length > 3 && (
                <div className="text-xs text-muted-foreground pl-1">
                  +{dayRequests.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Week View Component
const WeekView = ({ 
  currentDate, 
  requests, 
  onEventClick,
  onDateClick
}: { 
  currentDate: Date;
  requests: MaintenanceRequest[];
  onEventClick: (request: MaintenanceRequest) => void;
  onDateClick: (date: Date) => void;
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="overflow-auto max-h-[600px]">
      <div className="grid grid-cols-8 sticky top-0 bg-card z-10 border-b border-border">
        <div className="p-2 text-center text-xs text-muted-foreground"></div>
        {days.map((day) => (
          <div 
            key={day.toISOString()} 
            className="p-2 text-center border-l border-border"
          >
            <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
            <div className={cn(
              'text-lg font-semibold w-8 h-8 flex items-center justify-center mx-auto rounded-full',
              isToday(day) && 'bg-primary text-primary-foreground'
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      {hours.map((hour) => (
        <div key={hour} className="grid grid-cols-8 border-b border-border">
          <div className="p-2 text-xs text-muted-foreground text-right pr-4">
            {format(new Date().setHours(hour, 0), 'h a')}
          </div>
          {days.map((day) => {
            const dayRequests = requests.filter(r => isSameDay(parseISO(r.scheduledDate), day));
            // Show requests at 9 AM slot for simplicity
            const showRequests = hour === 9 && dayRequests.length > 0;
            
            return (
              <div 
                key={`${day.toISOString()}-${hour}`}
                className="min-h-[50px] border-l border-border p-1 cursor-pointer hover:bg-muted/50"
                onClick={() => onDateClick(day)}
              >
                {showRequests && dayRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(request);
                    }}
                    className={cn(
                      'text-xs p-1 rounded mb-1 truncate cursor-pointer border',
                      priorityColors[request.priority]
                    )}
                  >
                    {request.subject}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Day View Component
const DayView = ({ 
  currentDate, 
  requests, 
  onEventClick,
  onDateClick
}: { 
  currentDate: Date;
  requests: MaintenanceRequest[];
  onEventClick: (request: MaintenanceRequest) => void;
  onDateClick: (date: Date) => void;
}) => {
  const dayRequests = requests.filter(r => isSameDay(parseISO(r.scheduledDate), currentDate));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="overflow-auto max-h-[600px]">
      {hours.map((hour) => {
        // Show all requests at 9 AM for simplicity
        const showRequests = hour === 9 && dayRequests.length > 0;
        
        return (
          <div 
            key={hour} 
            className="grid grid-cols-12 border-b border-border cursor-pointer hover:bg-muted/30"
            onClick={() => onDateClick(currentDate)}
          >
            <div className="col-span-1 p-3 text-sm text-muted-foreground text-right border-r border-border">
              {format(new Date().setHours(hour, 0), 'h a')}
            </div>
            <div className="col-span-11 min-h-[60px] p-2">
              {showRequests && (
                <div className="space-y-2">
                  {dayRequests.map((request) => {
                    const equipment = getEquipmentById(request.equipmentId);
                    const technician = request.assignedTechnicianId 
                      ? getTechnicianById(request.assignedTechnicianId) 
                      : null;
                    
                    return (
                      <div
                        key={request.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(request);
                        }}
                        className={cn(
                          'p-3 rounded-lg cursor-pointer border',
                          priorityColors[request.priority]
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{request.subject}</p>
                            <p className="text-sm opacity-80">{equipment?.name}</p>
                            {technician && (
                              <p className="text-xs opacity-70 mt-1">
                                Assigned: {technician.name}
                              </p>
                            )}
                          </div>
                          <PriorityBadge priority={request.priority} />
                        </div>
                        <div className="text-xs mt-2 opacity-70">
                          Duration: {request.duration}h
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
