import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { motion } from 'framer-motion';
import { Kanban } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreateRequestDialog } from '@/components/dialogs/CreateRequestDialog';
import { FilterDialog, KanbanFilters } from '@/components/dialogs/FilterDialog';
import { ViewMode } from '@/components/ui/ViewModeToggle';
import { useData } from '@/contexts/DataContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

const KanbanPage = () => {
  const { requests, equipment } = useData();
  const [searchParams] = useSearchParams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<KanbanFilters>({
    equipmentId: '',
    teamId: '',
    technicianId: '',
    type: '',
    priority: '',
    status: '',
  });

  // Handle URL filter params from dashboard
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'open') {
      setFilters(prev => ({ ...prev, status: '' }));
    } else if (filterParam === 'completed') {
      setFilters(prev => ({ ...prev, status: 'repaired' }));
    }
  }, [searchParams]);

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

  // Filter requests for list view
  const filteredRequests = requests.filter((request) => {
    const eq = equipment.find(e => e.id === request.equipmentId);
    const searchLower = search.toLowerCase();
    
    const matchesSearch = 
      request.subject.toLowerCase().includes(searchLower) ||
      eq?.name.toLowerCase().includes(searchLower) ||
      request.status.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Apply dashboard filter
    const filterParam = searchParams.get('filter');
    if (filterParam === 'open' && (request.status === 'repaired' || request.status === 'scrap')) {
      return false;
    }
    if (filterParam === 'completed' && request.status !== 'repaired') {
      return false;
    }

    // Apply other filters
    if (filters.equipmentId && request.equipmentId !== filters.equipmentId) return false;
    if (filters.status && request.status !== filters.status) return false;
    if (filters.priority && request.priority !== filters.priority) return false;
    if (filters.type && request.type !== filters.type) return false;

    return true;
  });

  const getEquipmentName = (equipmentId: string) => {
    return equipment.find(e => e.id === equipmentId)?.name || 'Unknown';
  };

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        <PageHeader
          icon={Kanban}
          title="Requests"
          description={viewMode === 'grid' ? 'Drag and drop to manage request status' : 'View and manage maintenance requests'}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search requests..."
          showFilter
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setShowFilterDialog(true)}
          onClearFilters={handleClearFilters}
          showViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addButtonLabel="New Request"
          onAddClick={() => setShowCreateDialog(true)}
        />

        {/* Board or List View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {viewMode === 'grid' ? (
            <KanbanBoard filters={filters} search={search} />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{request.subject}</TableCell>
                      <TableCell>{getEquipmentName(request.equipmentId)}</TableCell>
                      <TableCell className="capitalize">{request.type}</TableCell>
                      <TableCell>
                        <PriorityBadge priority={request.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>{request.scheduledDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <Kanban className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              )}
            </div>
          )}
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
