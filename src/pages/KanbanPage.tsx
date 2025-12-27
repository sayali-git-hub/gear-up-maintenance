import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Kanban } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreateRequestDialog } from '@/components/dialogs/CreateRequestDialog';
import { FilterDialog, KanbanFilters } from '@/components/dialogs/FilterDialog';
import { ViewMode } from '@/components/ui/ViewModeToggle';
import { useData } from '@/contexts/DataContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getTeamById, getTechnicianById } from '@/lib/data';

const KanbanPage = () => {
  const { requests, equipment } = useData();
  const navigate = useNavigate();
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

  const filteredRequests = requests.filter((request) => {
    const eq = equipment.find(e => e.id === request.equipmentId);
    const searchLower = search.toLowerCase();
    
    const matchesSearch = 
      request.subject.toLowerCase().includes(searchLower) ||
      eq?.name.toLowerCase().includes(searchLower) ||
      request.status.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    const filterParam = searchParams.get('filter');
    if (filterParam === 'open' && (request.status === 'repaired' || request.status === 'scrap')) {
      return false;
    }
    if (filterParam === 'completed' && request.status !== 'repaired') {
      return false;
    }

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
      <div className="p-6 space-y-5">
        <PageHeader
          icon={Kanban}
          title="Requests"
          description={viewMode === 'grid' ? 'Drag and drop to update status' : 'All maintenance requests'}
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

        {viewMode === 'grid' ? (
          <KanbanBoard filters={filters} search={search} />
        ) : (
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Equipment</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Team</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Technician</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const team = request.teamId ? getTeamById(request.teamId) : null;
                  const technician = request.assignedTechnicianId 
                    ? getTechnicianById(request.assignedTechnicianId) 
                    : null;
                  return (
                    <TableRow 
                      key={request.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/requests/${request.id}`)}
                    >
                      <TableCell className="font-medium text-sm">{request.subject}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{getEquipmentName(request.equipmentId)}</TableCell>
                      <TableCell>
                        {team ? (
                          <span className="text-xs font-medium text-muted-foreground">{team.name}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {technician ? (
                          <span className="text-sm">{technician.name}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs capitalize text-muted-foreground">{request.type}</span>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={request.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{request.scheduledDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No requests found</p>
              </div>
            )}
          </div>
        )}
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
