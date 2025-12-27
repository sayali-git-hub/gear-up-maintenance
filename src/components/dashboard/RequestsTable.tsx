import { useData } from '@/contexts/DataContext';
import { getEquipmentById, getTechnicianById, getTeamById } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  new: 'bg-blue-500 hover:bg-blue-600',
  in_progress: 'bg-amber-500 hover:bg-amber-600',
  repaired: 'bg-emerald-500 hover:bg-emerald-600',
  scrap: 'bg-red-500 hover:bg-red-600',
};

const statusLabels: Record<string, string> = {
  new: 'New Request',
  in_progress: 'In Progress',
  repaired: 'Repaired',
  scrap: 'Scrapped',
};

export const RequestsTable = () => {
  const { requests, equipment, teams } = useData();

  // Get recent/active requests (non-completed first, then by date)
  const sortedRequests = [...requests]
    .sort((a, b) => {
      // Non-completed first
      const aComplete = a.status === 'repaired' || a.status === 'scrap';
      const bComplete = b.status === 'repaired' || b.status === 'scrap';
      if (aComplete !== bComplete) return aComplete ? 1 : -1;
      // Then by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border bg-card overflow-hidden"
    >
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Recent Maintenance Requests</h3>
        <p className="text-sm text-muted-foreground">Quick overview of active and recent requests</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRequests.map((request) => {
            const eq = getEquipmentById(request.equipmentId);
            const tech = request.assignedTechnicianId 
              ? getTechnicianById(request.assignedTechnicianId) 
              : null;
            const team = eq ? getTeamById(eq.maintenanceTeamId) : null;

            return (
              <TableRow key={request.id} className="hover:bg-muted/50">
                <TableCell className="font-medium max-w-[200px] truncate">
                  {request.subject}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {eq?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  {tech ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{tech.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {eq?.department || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={cn(
                      'text-white border-0',
                      statusColors[request.status]
                    )}
                  >
                    {statusLabels[request.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {team?.name || 'N/A'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </motion.div>
  );
};
