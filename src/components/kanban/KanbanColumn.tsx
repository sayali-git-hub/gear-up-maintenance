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
    <div className="flex flex-col min-w-[300px] max-w-[300px]">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn('w-2 h-2 rounded-full', color)} />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {requests.length}
        </span>
      </div>
      
      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 space-y-2 p-2 rounded-lg min-h-[400px] transition-colors border border-transparent',
              snapshot.isDraggingOver && 'bg-accent/50 border-primary/20'
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
            {requests.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 border border-dashed border-border rounded-lg">
                <p className="text-xs text-muted-foreground">No requests</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
