import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { motion } from 'framer-motion';
import { Kanban, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CreateRequestDialog } from '@/components/dialogs/CreateRequestDialog';

const KanbanPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Kanban className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Kanban Board</h1>
              <p className="text-sm text-muted-foreground">
                Drag and drop to manage request status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </div>
        </motion.div>

        {/* Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <KanbanBoard />
        </motion.div>
      </div>

      <CreateRequestDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </MainLayout>
  );
};

export default KanbanPage;
