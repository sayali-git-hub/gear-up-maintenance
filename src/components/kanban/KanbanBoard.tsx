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
}

export const KanbanBoard = ({ filters }: KanbanBoardProps) => {
  const { requests, equipment, updateRequestStatus } = useData();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as MaintenanceStatus;
    
    updateRequestStatus(draggableId, newStatus);
  };

  // Apply filters
  const filteredRequests = requests.filter((req) => {
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
