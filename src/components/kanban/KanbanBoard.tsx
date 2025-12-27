import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useData } from '@/contexts/DataContext';
import { KanbanColumn } from './KanbanColumn';
import { MaintenanceStatus } from '@/lib/data';

const columns: { status: MaintenanceStatus; title: string; color: string }[] = [
  { status: 'new', title: 'New', color: 'bg-status-new' },
  { status: 'in_progress', title: 'In Progress', color: 'bg-status-progress' },
  { status: 'repaired', title: 'Repaired', color: 'bg-status-repaired' },
  { status: 'scrap', title: 'Scrap', color: 'bg-status-scrap' },
];

export const KanbanBoard = () => {
  const { requests, updateRequestStatus } = useData();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as MaintenanceStatus;
    
    updateRequestStatus(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 px-1">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            title={column.title}
            color={column.color}
            requests={requests.filter((r) => r.status === column.status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
