import { MainLayout } from '@/components/layout/MainLayout';
import { MaintenanceCalendar } from '@/components/calendar/MaintenanceCalendar';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage = () => {
  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-primary/10">
            <CalendarIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar View</h1>
            <p className="text-sm text-muted-foreground">
              Schedule and view preventive maintenance
            </p>
          </div>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MaintenanceCalendar />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
