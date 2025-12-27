import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { motion } from 'framer-motion';
import { Kanban, Plus, Filter, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CreateRequestDialog } from '@/components/dialogs/CreateRequestDialog';
import { FilterDialog, KanbanFilters } from '@/components/dialogs/FilterDialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const KanbanPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<KanbanFilters>({
    equipmentId: '',
    teamId: '',
    technicianId: '',
    type: '',
    priority: '',
    status: '',
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleClearFilters = () => {
    setFilters({
      equipmentId: '',
      teamId: '',
      technicianId: '',
      type: '',
      priority: '',
      status: '',
    });
  };

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
              <h1 className="text-2xl font-bold tracking-tight">Requests</h1>
              <p className="text-sm text-muted-foreground">
                Drag and drop to manage request status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowFilterDialog(true)}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearFilters}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
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
          <KanbanBoard filters={filters} search={search} />
        </motion.div>
      </div>

      <CreateRequestDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
      
      <FilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </MainLayout>
  );
};

export default KanbanPage;
