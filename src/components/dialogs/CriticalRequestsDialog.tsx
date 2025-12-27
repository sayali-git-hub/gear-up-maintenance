import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { KanbanCard } from '@/components/kanban/KanbanCard';
import { isPast, parseISO } from 'date-fns';
import { AlertTriangle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CriticalRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CriticalRequestsDialog = ({
  open,
  onOpenChange,
}: CriticalRequestsDialogProps) => {
  const { requests } = useData();

  const criticalRequests = requests.filter(
    (r) => r.priority === 'critical' && r.status !== 'repaired' && r.status !== 'scrap'
  );

  const overdueRequests = requests.filter(
    (r) =>
      r.status !== 'repaired' &&
      r.status !== 'scrap' &&
      isPast(parseISO(r.scheduledDate))
  );

  const highPriorityRequests = requests.filter(
    (r) => r.priority === 'high' && r.status !== 'repaired' && r.status !== 'scrap'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Critical & Overdue Requests
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="critical" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="critical" className="gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Critical ({criticalRequests.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-1.5">
              <Clock className="w-4 h-4" />
              Overdue ({overdueRequests.length})
            </TabsTrigger>
            <TabsTrigger value="high" className="gap-1.5">
              High Priority ({highPriorityRequests.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="critical" className="m-0">
              {criticalRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No critical requests at this time
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criticalRequests.map((request) => (
                    <KanbanCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="overdue" className="m-0">
              {overdueRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No overdue requests
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {overdueRequests.map((request) => (
                    <KanbanCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="high" className="m-0">
              {highPriorityRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No high priority requests
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriorityRequests.map((request) => (
                    <KanbanCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
