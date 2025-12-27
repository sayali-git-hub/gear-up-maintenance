import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MaintenanceRequest, MaintenanceStatus } from '@/lib/data';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface KanbanColumnProps {
  status: MaintenanceStatus;
  requests: MaintenanceRequest[];
  title: string;
  color: string;
}

const statusConfig: Record<MaintenanceStatus, { gradient: string; border: string; bg: string }> = {
  new: {
    gradient: 'from-[hsl(var(--status-new))] to-[hsl(217,85%,50%)]',
    border: 'border-[hsl(var(--status-new)/0.3)]',
    bg: 'bg-[hsl(var(--status-new)/0.05)]',
  },
  in_progress: {
    gradient: 'from-[hsl(var(--status-progress))] to-[hsl(35,90%,45%)]',
    border: 'border-[hsl(var(--status-progress)/0.3)]',
    bg: 'bg-[hsl(var(--status-progress)/0.05)]',
  },
  repaired: {
    gradient: 'from-[hsl(var(--status-repaired))] to-[hsl(150,70%,35%)]',
    border: 'border-[hsl(var(--status-repaired)/0.3)]',
    bg: 'bg-[hsl(var(--status-repaired)/0.05)]',
  },
  scrap: {
    gradient: 'from-[hsl(var(--status-scrap))] to-[hsl(0,70%,45%)]',
    border: 'border-[hsl(var(--status-scrap)/0.3)]',
    bg: 'bg-[hsl(var(--status-scrap)/0.05)]',
  },
};

export const KanbanColumn = ({ status, requests, title, color }: KanbanColumnProps) => {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-w-[320px] max-w-[320px]"
    >
      {/* Column Header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className={cn('w-3 h-3 rounded-full bg-gradient-to-br', config.gradient, 'shadow-sm')} />
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className={cn(
          'ml-auto text-xs font-semibold px-2.5 py-1 rounded-full transition-all',
          requests.length > 0 
            ? cn('bg-gradient-to-r text-white', config.gradient)
            : 'bg-muted text-muted-foreground'
        )}>
          {requests.length}
        </span>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 space-y-3 p-3 rounded-xl min-h-[200px] transition-all duration-300 border-2 border-dashed',
              snapshot.isDraggingOver 
                ? cn(config.bg, config.border, 'scale-[1.01]') 
                : 'border-transparent bg-muted/30'
            )}
          >
            {requests.map((request, index) => (
              <Draggable key={request.id} draggableId={request.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      transition: snapshot.isDragging 
                        ? 'none' 
                        : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
                    }}
                  >
                    <KanbanCard request={request} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {/* Empty state */}
            {requests.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                <div className={cn('w-10 h-10 rounded-full mb-2 opacity-30 bg-gradient-to-br', config.gradient)} />
                <p className="text-xs">Drop requests here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </motion.div>
  );
};
