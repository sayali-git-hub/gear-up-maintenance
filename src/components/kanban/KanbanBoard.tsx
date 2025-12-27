import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useData } from '@/contexts/DataContext';
import { KanbanColumn } from './KanbanColumn';
import { MaintenanceStatus } from '@/lib/data';
import { KanbanFilters } from '@/components/dialogs/FilterDialog';

const columns: { status: MaintenanceStatus; title: string; color: string }[] = [
  { status: 'new', title: 'New', color: 'bg-status-new' },
  { status: 'in_progress', title: 'In Progress', color: 'bg-status-progress' },
  { status: 'repaired', title: 'Repaired', color: 'bg-status-repaired' },
  { status: 'scrap', title: 'Scrap', color: 'bg-status-scrap' },
];

interface KanbanBoardProps {
  filters?: KanbanFilters;
  search?: string;
}

export const KanbanBoard = ({ filters, search }: KanbanBoardProps) => {
  const { requests, equipment, updateRequestStatus } = useData();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as MaintenanceStatus;
    
    updateRequestStatus(draggableId, newStatus);
  };

  // Apply filters and search
  const filteredRequests = requests.filter((req) => {
    // Text search
    if (search) {
      const searchLower = search.toLowerCase();
      const eq = equipment.find((e) => e.id === req.equipmentId);
      const matchesSearch = 
        req.subject.toLowerCase().includes(searchLower) ||
        eq?.name.toLowerCase().includes(searchLower) ||
        req.status.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Apply filters
    if (filters?.equipmentId && req.equipmentId !== filters.equipmentId) return false;
    
    if (filters?.teamId) {
      const eq = equipment.find((e) => e.id === req.equipmentId);
      if (eq?.maintenanceTeamId !== filters.teamId) return false;
    }
    
    if (filters?.technicianId && req.assignedTechnicianId !== filters.technicianId) return false;
    if (filters?.type && req.type !== filters.type) return false;
    if (filters?.priority && req.priority !== filters.priority) return false;
    if (filters?.status && req.status !== filters.status) return false;
    
    return true;
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 px-1">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            title={column.title}
            color={column.color}
            requests={filteredRequests.filter((r) => r.status === column.status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
