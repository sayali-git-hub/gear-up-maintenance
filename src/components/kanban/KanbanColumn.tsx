import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MaintenanceRequest, MaintenanceStatus } from '@/lib/data';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: MaintenanceStatus;
  requests: MaintenanceRequest[];
  title: string;
  color: string;
}

export const KanbanColumn = ({ status, requests, title, color }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px]">
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className={cn('w-3 h-3 rounded-full', color)} />
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="ml-auto text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {requests.length}
        </span>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 space-y-3 p-2 rounded-xl min-h-[200px] transition-colors duration-200',
              snapshot.isDraggingOver ? 'bg-accent/50' : 'bg-transparent'
            )}
          >
            {requests.map((request, index) => (
              <Draggable key={request.id} draggableId={request.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KanbanCard request={request} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
