import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import { AddEquipmentDialog } from '@/components/dialogs/AddEquipmentDialog';
import { EquipmentFilterDialog, EquipmentFilters } from '@/components/dialogs/EquipmentFilterDialog';
import { Badge } from '@/components/ui/badge';
import { ViewMode } from '@/components/ui/ViewModeToggle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EquipmentStatusBadge } from '@/components/ui/EquipmentStatusBadge';
import { useNavigate } from 'react-router-dom';

const EquipmentPage = () => {
  const { equipment, requests } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<EquipmentFilters>({
    department: '',
    teamId: '',
    location: '',
    ownerType: '',
    status: '',
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleClearFilters = () => {
    setFilters({
      department: '',
      teamId: '',
      location: '',
      ownerType: '',
      status: '',
    });
  };

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      eq.department.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filters.department && eq.department !== filters.department) return false;
    if (filters.teamId && eq.maintenanceTeamId !== filters.teamId) return false;
    if (filters.location && eq.location !== filters.location) return false;
    if (filters.status && eq.status !== filters.status) return false;
    if (filters.ownerType) {
      const isTeamOwned = eq.owner.toLowerCase().includes('team');
      if (filters.ownerType === 'team' && !isTeamOwned) return false;
      if (filters.ownerType === 'department' && isTeamOwned) return false;
    }

    return true;
  });

  const getOpenRequestsCount = (equipmentId: string) => {
    return requests.filter(r => r.equipmentId === equipmentId && r.status !== 'repaired' && r.status !== 'scrap').length;
  };

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        <PageHeader
          icon={Settings2}
          title="Equipments Registry"
          description="Manage and track all your equipments"
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search equipments..."
          showFilter
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setShowFilterDialog(true)}
          onClearFilters={handleClearFilters}
          showViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addButtonLabel="Add Equipment"
          onAddClick={() => setShowAddDialog(true)}
        />

        {/* Equipment Grid or List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((eq, index) => (
              <EquipmentCard 
                key={eq.id} 
                equipment={eq} 
                delay={index * 0.05}
              />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Open Requests</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((eq) => (
                  <TableRow 
                    key={eq.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/equipment/${eq.id}`)}
                  >
                    <TableCell className="font-medium">{eq.name}</TableCell>
                    <TableCell className="font-mono text-sm">{eq.serialNumber}</TableCell>
                    <TableCell>{eq.department}</TableCell>
                    <TableCell>{eq.location}</TableCell>
                    <TableCell>
                      <EquipmentStatusBadge status={eq.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={getOpenRequestsCount(eq.id) > 0 ? "destructive" : "secondary"}>
                        {getOpenRequestsCount(eq.id)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredEquipment.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Settings2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No equipments found</p>
          </motion.div>
        )}
      </div>

      <AddEquipmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <EquipmentFilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </MainLayout>
  );
};

export default EquipmentPage;
